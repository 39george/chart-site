use anyhow::Context;
use axum::Json;
use axum::{extract::State, routing, Router};

use crate::auth::users::AuthSession;
use crate::cornucopia::queries::open_access::{self, FetchSongs};
use crate::startup::AppState;

use super::ResponseError;

pub fn open_router() -> Router<AppState> {
    Router::new()
        .route("/songs", routing::get(fetch_songs))
        .route("/genres", routing::get(genres))
}

async fn fetch_songs(
    State(state): State<AppState>,
) -> Result<Json<Vec<FetchSongs>>, ResponseError> {
    let db_client = state
        .pg_pool
        .get()
        .await
        .context("Failed to get connection from postgres pool")
        .map_err(ResponseError::UnexpectedError)?;
    let songs = open_access::fetch_songs()
        .bind(&db_client)
        .all()
        .await
        .context("Failed to fetch songs from pg")?;
    Ok(Json(songs))
}

async fn genres(
    auth_session: AuthSession,
    State(state): State<AppState>,
) -> Result<Json<Vec<String>>, ResponseError> {
    let _admin = auth_session.user.ok_or(ResponseError::UnauthorizedError(
        anyhow::anyhow!("No such user in AuthSession!"),
    ))?;
    let db_client = state
        .pg_pool
        .get()
        .await
        .context("Failed to get connection from postgres pool")
        .map_err(ResponseError::UnexpectedError)?;
    let genres = open_access::list_genres()
        .bind(&db_client)
        .all()
        .await
        .context("Failed to fetch genres from pg")?;
    Ok(Json(genres))
}
