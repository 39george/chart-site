use axum::Router;

use crate::startup::AppState;

pub fn dev_router(state: AppState) -> Router {
    Router::new()
}
