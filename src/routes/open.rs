use std::time::Duration;

use anyhow::anyhow;
use anyhow::Context;
use axum::extract::Path;
use axum::Json;
use axum::{extract::State, routing, Router};
use futures::future::try_join_all;
use http::StatusCode;

use crate::cornucopia::queries::open_access::{self};
use crate::domain::open::FetchSongs;
use crate::startup::api_doc::BadRequestResponse;
use crate::startup::api_doc::InternalErrorResponse;
use crate::startup::AppState;

use super::ResponseError;

pub fn open_router() -> Router<AppState> {
    Router::new()
        .route("/songs", routing::get(fetch_songs))
        .route("/audio_url/:id", routing::get(get_audio_url))
        .route("/:what", routing::get(data))
}

/// Fetch songs
#[utoipa::path(
    get,
    path = "/api/open/songs",
    responses(
        (status = 200, response = crate::domain::open::FetchSongs),
        (status = 500, response = InternalErrorResponse)
    ),
    tag = "open"
    
)]
async fn fetch_songs(
    State(state): State<AppState>,
) -> Result<Json<Vec<FetchSongs>>, ResponseError> {
    let db_client = state
        .pg_pool
        .get()
        .await
        .context("Failed to get connection from postgres pool")
        .map_err(ResponseError::UnexpectedError)?;
    // TODO: simplify code
    let futures = open_access::fetch_songs()
        .bind(&db_client)
        .all()
        .await
        .context("Failed to fetch songs from pg")?.into_iter().map(|mut entry| async {
            let expiration = std::time::Duration::from_secs(30 * 60);
            entry.cover_url = state.object_storage.generate_presigned_url(&entry.cover_url.parse().context("Failed to parse object key")?, expiration).await.context("Failed to generate presigned url")?;
            Ok::<FetchSongs, anyhow::Error>(entry.into())
        });
    let songs = try_join_all(futures).await?;

    Ok(Json(songs))
}

/// Retrieve audio url for song by id, returns plain string url
#[utoipa::path(
    get,
    path = "/api/open/audio_url/{id}",
    responses(
        (status = 200, body = String, content_type = "text/plain"),
        (status = 500, response = InternalErrorResponse)
    ),
    tag = "open"
    
)]
async fn get_audio_url(
    State(state): State<AppState>,
    Path(song_id): Path<i32>,
) -> Result<String, ResponseError> {
    let db_client = state
        .pg_pool
        .get()
        .await
        .context("Failed to get connection from postgres pool")
        .map_err(ResponseError::UnexpectedError)?;
    let obj_key = open_access::get_song_audio_obj_key_by_id()
        .bind(&db_client, &song_id)
        .one()
        .await
        .map_err(|e| {
            if e.to_string()
                .eq("query returned an unexpected number of rows")
            {
                ResponseError::NotFoundError(
                    anyhow!("Not found, err: {e}"),
                    "Song not found",
                )
            } else {
                ResponseError::UnexpectedError(anyhow!("{e}"))
            }
        })?
        .parse()
        .context("Failed to parse object key from string")?;
    let url = state
        .object_storage
        .generate_presigned_url(&obj_key, Duration::from_secs(60 * 10))
        .await?;
    Ok(url)
}


/// Fetch genres or moods list
#[utoipa::path(
    get,
    path = "/api/open/{what}",
    responses(
        (status = 200, body = Vec<String>, content_type = "application/json"),
        (status = 400, response = BadRequestResponse),
        (status = 500, response = InternalErrorResponse)
    ),
    tag = "open"
    
)]
async fn data(
    State(state): State<AppState>,
    Path(what): Path<String>,
) -> Result<Json<Vec<String>>, ResponseError> {
    let db_client = state
        .pg_pool
        .get()
        .await
        .context("Failed to get connection from postgres pool")
        .map_err(ResponseError::UnexpectedError)?;
    let response = match what.as_str() {
        "genres" => open_access::list_genres()
            .bind(&db_client)
            .all()
            .await
            .context("Failed to fetch genres from pg")?,
        "moods" => open_access::list_moods()
            .bind(&db_client)
            .all()
            .await
            .context("Failed to fetch genres from pg")?,
        _ => {
            return Err(ResponseError::BadRequest(anyhow!(
                "Only genres and moods available"
            )))
        }
    };
    Ok(Json(response))
}
