//! This is a module with common initialization functions.

use argon2::Argon2;
use argon2::PasswordHasher;

use argon2::password_hash::SaltString;
use chart_site::object_storage::presigned_post_form::PresignedPostData;
use chart_site::startup::get_redis_connection_pool;
use deadpool_postgres::Client;
use fake::Fake;
use fred::clients::RedisClient;
use reqwest::multipart::Form;
use reqwest::multipart::Part;
use secrecy::Secret;
use tracing::Level;

use chart_site::config::DatabaseSettings;
use chart_site::config::Settings;
use chart_site::startup::get_postgres_connection_pool;
use chart_site::startup::Application;

#[derive(Debug)]
pub struct Admin {
    pub username: String,
    pub password: String,
}

/// This type contains MockServer, and it's address.
/// MockServer represents a email delivery service,
/// such as Postmark or SMTP.bz
pub struct TestApp {
    pg_username: String,
    pg_config_with_root_cred: DatabaseSettings,
    argon: Argon2<'static>,
    pub address: String,
    pub pg_client: Client,
    pub redis_client: RedisClient,
    pub port: u16,
}

/// Confirmation links embedded in the request to the email API.
#[derive(Debug)]
pub struct ConfirmationLink(pub reqwest::Url);

impl TestApp {
    pub async fn new_admin(&self) -> Result<Admin, tokio_postgres::Error> {
        let username = fake::faker::name::en::Name().fake();
        let password = String::from("A23c(fds)Helloworld232r");
        let password_hash = hash_password(&password, &self.argon);
        let id = self
            .pg_client
            .query_one(
                "
                INSERT INTO users (username, password_hash)
                VALUES ($1, $2) RETURNING id",
                &[&username, &password_hash],
            )
            .await?
            .get::<&str, i32>("id");
        self.pg_client
            .query_opt(
                "
                INSERT INTO users_groups (users_id, groups_id)
                VALUES (
                    (SELECT id FROM groups WHERE name = 'group.administrators'),
                    $1
                )
            ",
                &[&id],
            )
            .await?;
        Ok(Admin { username, password })
    }

    pub async fn spawn_app(mut config: Settings) -> TestApp {
        init_tracing();

        // Run tests on 1st redis database
        config.redis.db_number = 3;
        config.object_storage.bucket_name =
            String::from("chart-site-test-data");
        let redis_client = get_redis_connection_pool(&config.redis)
            .await
            .unwrap()
            .next()
            .clone_new();

        fred::interfaces::ClientLike::connect(&redis_client);
        fred::interfaces::ClientLike::wait_for_connect(&redis_client)
            .await
            .unwrap();

        config.app_port = 0;

        let pg_config_with_root_cred = config.database.clone();
        let (pg_config, pg_pool, pg_username) =
            prepare_postgres_with_rand_user(config.database.clone()).await;
        config.database = pg_config;

        let application = Application::build(config)
            .await
            .expect("Failed to build application");

        let port = application.port();

        let address = format!("http://127.0.0.1:{}", port);

        // Very important step
        let _ = tokio::spawn(application.run_until_stopped());

        let argon = argon2::Argon2::new(
            argon2::Algorithm::Argon2id,
            argon2::Version::V0x13,
            // Params are good
            argon2::Params::new(15000, 2, 1, None).unwrap(),
        );

        TestApp {
            pg_username,
            pg_config_with_root_cred,
            address,
            pg_client: pg_pool,
            port,
            redis_client,
            argon,
        }
    }

    pub async fn login_admin(
        &self,
        admin: &Admin,
        client: &reqwest::Client,
    ) -> reqwest::StatusCode {
        let response = client
            .post(format!("{}/api/login", &self.address))
            .json(&serde_json::json!({
                "username": admin.username,
                "password": admin.password
            }))
            .send()
            .await
            .unwrap();
        response.status()
    }

    pub async fn upload_file_get_objkey(
        &self,
        client_with_cookies: &reqwest::Client,
        media_type: &str,
        name: &str,
        file: Vec<u8>,
    ) -> (reqwest::Response, String) {
        let response = client_with_cookies
            .get(format!(
                "{}/api/protected/upload_form?media_type={}&file_name={}",
                self.address, media_type, name
            ))
            .send()
            .await
            .unwrap();
        let post_form: PresignedPostData = response.json().await.unwrap();
        let object_key = post_form.fields.get("key").unwrap().clone();
        let url = post_form.url;
        let mut multipart = Form::new();
        for (key, value) in post_form.fields.into_iter() {
            multipart = multipart.text(key, value);
        }
        multipart = multipart.part("file", Part::bytes(file));
        (
            client_with_cookies
                .post(url)
                .multipart(multipart)
                .send()
                .await
                .unwrap(),
            object_key,
        )
    }
}

impl Drop for TestApp {
    fn drop(&mut self) {
        // Clean pg
        let db_config = self.pg_config_with_root_cred.clone();
        let db_username = self.pg_username.clone();
        // NOTE: Spawn a new thread, because internally sync postgres client uses
        // tokio runtime, but we are already in tokio runtime here. To
        // spawn a new tokio runtime, we should do it inside new thread.
        let _ = std::thread::spawn(move || {
            // Create the runtime
            let rt = tokio::runtime::Runtime::new().unwrap();
            // Execute the future, blocking the current thread until completion
            rt.block_on(async {
                let pg_pool = get_postgres_connection_pool(&db_config);
                let client = pg_pool.get().await.unwrap();
                let create_role =
                    format!("DROP SCHEMA {0} CASCADE;", db_username);
                let create_schema = format!("DROP ROLE {0};", db_username);
                println!("Executing: {create_role}");
                client.simple_query(&create_role).await.unwrap();
                println!("Executing: {create_schema}");
                client.simple_query(&create_schema).await.unwrap();
            });
        })
        .join();
    }
}

fn init_tracing() {
    use tracing_subscriber::fmt::format::FmtSpan;
    if let Ok(_) = std::env::var("TEST_TRACING") {
        let subscriber = tracing_subscriber::fmt()
            .with_timer(tracing_subscriber::fmt::time::ChronoLocal::default())
            .with_span_events(FmtSpan::NEW | FmtSpan::CLOSE)
            .with_env_filter(
                tracing_subscriber::EnvFilter::from_default_env()
                    .add_directive(Level::INFO.into())
                    .add_directive("tower_sessions_core=warn".parse().unwrap())
                    .add_directive("axum::rejection=trace".parse().unwrap())
                    .add_directive("aws_config=warn".parse().unwrap()),
            )
            .compact()
            .with_level(true)
            .finish();

        let _ = tracing::subscriber::set_global_default(subscriber);
    }
}

async fn prepare_postgres_with_rand_user(
    mut pg_config: DatabaseSettings,
) -> (DatabaseSettings, Client, String) {
    let pool = get_postgres_connection_pool(&pg_config);
    let pg_username = generate_username();
    let create_role =
        format!("CREATE ROLE {0} WITH LOGIN PASSWORD '{0}';", &pg_username);
    let create_schema =
        format!("CREATE SCHEMA {0} AUTHORIZATION {0};", &pg_username);
    let client = pool.get().await.unwrap();
    client.simple_query(&create_role).await.unwrap();
    client.simple_query(&create_schema).await.unwrap();
    drop(pool);
    pg_config.username = pg_username.clone();
    pg_config.password = Secret::new(pg_username.clone());
    let pg_pool = get_postgres_connection_pool(&pg_config);
    let client = pg_pool.get().await.unwrap();
    (pg_config, client, pg_username)
}

// ───── Helpers ──────────────────────────────────────────────────────────── //

pub fn generate_username() -> String {
    let mut rng = rand::thread_rng();
    format!(
        "test_{}",
        std::iter::repeat_with(|| {
            rand::Rng::sample(&mut rng, rand::distributions::Alphanumeric)
        })
        .map(|b| char::from(b).to_lowercase().next().unwrap())
        .take(5)
        .collect::<String>()
    )
}

fn hash_password(password: &str, argon2: &argon2::Argon2) -> String {
    let salt = SaltString::generate(&mut rand::thread_rng());
    argon2
        .hash_password(password.as_bytes(), &salt)
        .unwrap()
        .to_string()
}
