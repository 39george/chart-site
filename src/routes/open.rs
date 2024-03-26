use axum::Router;

use crate::startup::AppState;

pub fn open_router() -> Router<AppState> {
    Router::new()
}
