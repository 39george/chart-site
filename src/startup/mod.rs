use std::net::SocketAddr;
use std::sync::Arc;

use anyhow::Context;
use axum::extract::connect_info::IntoMakeServiceWithConnectInfo;
use axum::extract::ConnectInfo;
use axum::handler::Handler;
use axum::middleware::AddExtension;
use axum::serve::Serve;
use axum::{routing, Router};
use axum_login::AuthManagerLayerBuilder;
use fred::clients::RedisPool;
use fred::types::{ReconnectPolicy, RedisConfig};
use http::StatusCode;
use secrecy::ExposeSecret;
use time::UtcOffset;
use tokio::net::TcpListener;
use tower_http::trace::TraceLayer;
use tower_sessions::Session;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use crate::auth;
use crate::config::{DatabaseSettings, Environment, RedisSettings, Settings};
use crate::helpers::generic_pg::PgPool;
use crate::object_storage::ObjectStorage;
use crate::routes::session;
use crate::routes::{
    development, open::open_router, protected::protected_router,
};

use self::api_doc::ApiDoc;

pub mod api_doc;
mod db_migration;

lazy_static::lazy_static! {
    static ref MOSKOW_TIME_OFFSET: UtcOffset = UtcOffset::from_hms(3, 0, 0).unwrap();
}

type Server = Serve<
    IntoMakeServiceWithConnectInfo<Router, SocketAddr>,
    AddExtension<Router, ConnectInfo<SocketAddr>>,
>;

/// This is a central type of our codebase. `Application` type builds server
/// for both production and testing purposes.
pub struct Application {
    port: u16,
    server: Server,
}

/// Shareable type, we insert it to the main `Router` as state,
/// at the launch stage.
#[derive(Clone, Debug)]
pub struct AppState {
    pub pg_pool: PgPool,
    pub redis_pool: RedisPool,
    pub object_storage: ObjectStorage,
    pub argon2_obj: argon2::Argon2<'static>,
    pub settings: Arc<Settings>,
}

impl Application {
    /// Build a new server.
    ///
    /// This functions builds a new `Application` with given configuration.
    /// It also configures a pool of connections to the PostgreSQL database.
    pub async fn build(
        configuration: Settings,
    ) -> Result<Application, anyhow::Error> {
        let use_tls = configuration.env.eq(&Environment::Prod);
        let pg_pool = PgPool::new(
            configuration.database.connection_string().expose_secret(),
            use_tls,
        )
        .await
        .context("Failed to build pg connection pool")?;

        let redis_pool =
            get_redis_connection_pool(&configuration.redis, use_tls).await?;
        let redis_pool_tower_sessions =
            get_redis_connection_pool(&configuration.redis, use_tls).await?;

        let redis_client = redis_pool.next().clone_new();
        fred::interfaces::ClientLike::connect(&redis_client);
        fred::interfaces::ClientLike::wait_for_connect(&redis_client).await?;

        let object_storage =
            ObjectStorage::new(configuration.object_storage.clone()).await;
        db_migration::run_migration(&pg_pool).await;

        let address =
            format!("{}:{}", configuration.app_addr, configuration.app_port);
        tracing::info!("running on {} address", address);
        let listener = TcpListener::bind(address).await?;
        let port = listener.local_addr()?.port();

        let server = Self::build_server(
            listener,
            pg_pool,
            redis_pool,
            redis_pool_tower_sessions,
            object_storage,
            Arc::new(configuration),
        );

        Ok(Self { server, port })
    }

    pub fn port(&self) -> u16 {
        self.port
    }

    /// This function only returns when the application is stopped.
    pub async fn run_until_stopped(self) -> Result<(), std::io::Error> {
        tracing::info!("Started");
        self.server
            .with_graceful_shutdown(shutdown_signal())
            .await?;
        Ok(())
    }

    /// Configure `Server`.
    fn build_server(
        listener: TcpListener,
        pg_pool: PgPool,
        redis_pool: RedisPool,
        redis_pool_tower_sessions: RedisPool,
        object_storage: ObjectStorage,
        settings: Arc<Settings>,
    ) -> Server {
        let argon2_obj = argon2::Argon2::new(
            argon2::Algorithm::Argon2id,
            argon2::Version::V0x13,
            // Params are good
            argon2::Params::new(15000, 2, 1, None).unwrap(),
        );

        // We do not wrap pool into arc because internally it already has an
        // `Arc`, and copying is cheap.
        let app_state = AppState {
            pg_pool: pg_pool.clone(),
            redis_pool,
            object_storage,
            argon2_obj,
            settings,
        };

        // Set 'secure' attribute for cookies
        let with_secure = if let Ok(e) = std::env::var("ENVIRONMENT") {
            if e.eq("development") {
                false
            } else {
                true
            }
        } else {
            true
        };

        // This uses `tower-sessions` to establish a layer that will provide the session
        // as a request extension.
        let session_store = tower_sessions_redis_store::RedisStore::new(
            redis_pool_tower_sessions,
        );
        let session_layer =
            axum_login::tower_sessions::SessionManagerLayer::new(session_store)
                .with_secure(with_secure)
                .with_expiry(axum_login::tower_sessions::Expiry::OnInactivity(
                    time::Duration::days(1),
                ));

        // This combines the session layer with our backend to establish the auth
        // service which will provide the auth session as a request extension.
        let backend = crate::auth::users::Backend::new(app_state.clone());
        let auth_service =
            AuthManagerLayerBuilder::new(backend, session_layer.clone())
                .build();

        #[rustfmt::skip]
        let mut app = Router::new()
            .nest("/api/protected", protected_router())
            .nest("/api/open", open_router())
            .with_state(app_state.clone())
            .merge(auth::login::login_router(app_state.clone()))
            .layer(crate::middleware::map_response::BadRequestIntoJsonLayer) // 2
            .layer(auth_service) // 1
            .nest("/api/session", session::router(session_layer))
            .route("/api/healthcheck", routing::get(|| async { StatusCode::OK }));

        app = setup_test_tracing(app);
        app = setup_swagger(app, app_state);

        axum::serve(
            listener,
            app.into_make_service_with_connect_info::<std::net::SocketAddr>(),
        )
    }
}

fn setup_swagger(mut app: Router, app_state: AppState) -> Router {
    if let Ok(e) = std::env::var("ENVIRONMENT") {
        if e.eq("development") {
            app = app.merge(
                SwaggerUi::new("/swagger-ui")
                    .url("/api-docs/openapi.json", ApiDoc::openapi()),
            );
            app = app.nest("/api", development::dev_router(app_state));
        }
    }
    app
}

fn setup_test_tracing(mut app: Router) -> Router {
    if let Ok(_) = std::env::var("TEST_TRACING") {
        app = app.layer(
            TraceLayer::new_for_http()
                .make_span_with(
                    tower_http::trace::DefaultMakeSpan::new()
                        .level(tracing::Level::INFO),
                )
                .on_response(
                    tower_http::trace::DefaultOnResponse::new()
                        .level(tracing::Level::INFO),
                )
                .on_failure(
                    tower_http::trace::DefaultOnFailure::new()
                        .level(tracing::Level::ERROR),
                ),
        );
    }
    app
}

async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };
    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(
            tokio::signal::unix::SignalKind::terminate(),
        )
        .expect("failed to install signal handler")
        .recv()
        .await;
    };
    tokio::select! {
        () = ctrl_c => {},
        () = terminate => {},
    }
    tracing::info!("Terminate signal received");
}

pub async fn get_redis_connection_pool(
    configuration: &RedisSettings,
    use_tls: bool,
) -> Result<RedisPool, anyhow::Error> {
    let mut redis_config = RedisConfig::from_url_centralized(
        configuration.connection_string().expose_secret(),
    )
    .unwrap();
    if use_tls {
        redis_config.tls = Some(create_tls_config().into());
    }
    let redis_pool = fred::types::Builder::default_centralized()
        .set_config(redis_config)
        .set_policy(ReconnectPolicy::default())
        .build_pool(5)
        .expect("Failed to build redis connections pool");
    fred::interfaces::ClientLike::connect(&redis_pool);
    fred::interfaces::ClientLike::wait_for_connect(&redis_pool).await?;
    Ok(redis_pool)
}

fn create_tls_config() -> native_tls::TlsConnector {
    use fred::native_tls::TlsConnector as NativeTlsConnector;

    // or use `TlsConnector::default_native_tls()`
    NativeTlsConnector::builder()
        .use_sni(true)
        .danger_accept_invalid_certs(false)
        .build()
        .expect("Failed to create TLS config")
        .into()
}
