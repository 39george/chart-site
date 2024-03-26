use axum::{extract::State, routing, Router};
use axum_login::permission_required;
use http::StatusCode;

use crate::startup::AppState;

pub fn protected_router() -> Router<AppState> {
    Router::new()
        .route("/anyroute", routing::get(handler1))
        .layer(permission_required!(
            crate::auth::users::Backend,
            "administrator"
        ))
}

async fn handler1(State(_state): State<AppState>) -> StatusCode {
    StatusCode::OK
}
