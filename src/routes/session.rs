use anyhow::Context;
use axum::{routing, Json, Router};
use fred::clients::RedisPool;
use http::StatusCode;
use serde::{Deserialize, Serialize};
use tower_sessions::{Session, SessionManagerLayer};
use tower_sessions_redis_store::RedisStore;
use utoipa::{openapi::request_body, ToResponse, ToSchema};

use crate::startup::api_doc::InternalErrorResponse;

use super::ResponseError;

#[derive(Debug, PartialEq, Deserialize, Serialize, ToResponse, ToSchema)]
#[response(
    description = "Current theme value",
    content_type = "application/json",
    example = json!(["White"]),
)]
pub enum ThemeValue {
    White,
    Dark,
}

pub fn router(session: SessionManagerLayer<RedisStore<RedisPool>>) -> Router {
    Router::new()
        .route("/theme", routing::get(get_theme))
        .route("/theme", routing::put(set_theme))
        .layer(session)
}

/// Get selected color theme.
#[utoipa::path(
    get,
    path = "/api/session/theme",
    responses(
        (status = 200, response = ThemeValue),
        (status = 500, response = InternalErrorResponse)
    ),
    tag = "open"
)]
async fn get_theme(
    session: Session,
) -> Result<Json<ThemeValue>, ResponseError> {
    let theme: Option<ThemeValue> = session
        .get("theme")
        .await
        .context("Failed to get theme value from session")?;
    if theme.is_none() {
        session
            .insert("theme", ThemeValue::White)
            .await
            .context("Failed to insert default theme value")?;
        return Ok(Json(ThemeValue::White));
    } else {
        return Ok(Json(theme.unwrap()));
    }
}

/// Set theme value.
#[utoipa::path(
    put,
    path = "/api/session/theme",
    request_body(
        content = ThemeValue,
        content_type = "application/Json",
        example = json!(["White"]),
    ),
    responses(
        (status = 200, description = "Theme successfull set"),
        (status = 500, response = InternalErrorResponse)
    ),
    tag = "open"
)]
async fn set_theme(
    session: Session,
    Json(theme): Json<ThemeValue>,
) -> Result<StatusCode, ResponseError> {
    session
        .insert("theme", theme)
        .await
        .context("Failed to set theme value from session")?;
    Ok(StatusCode::OK)
}
