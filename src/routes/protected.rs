use anyhow::Context;
use axum::extract::{Path, Query};
use axum::Json;
use axum::{extract::State, routing, Router};
use axum_login::permission_required;
use cornucopia_async::GenericClient;
use garde::Validate;
use http::StatusCode;
use anyhow::anyhow;

use crate::auth::users::AuthSession;
use crate::cornucopia::queries::admin_access;
use crate::domain::object_key::ObjectKey;
use crate::domain::requests::{SubmitSong, UploadFileRequest};
use crate::object_storage::presigned_post_form::PresignedPostData;
use crate::startup::api_doc::{ForbiddenResponse, InternalErrorResponse, NotFoundResponse};
use crate::startup::AppState;
use crate::trace_err;

use super::{ResponseError, MAX_SIZES};

pub fn protected_router() -> Router<AppState> {
    Router::new()
        .route("/upload_form", routing::get(upload_form))
        .route("/song", routing::post(submit_song))
        .route("/song/:id", routing::delete(remove_song))
        .route("/song/:id", routing::put(update_song))
        .route("/genres", routing::post(add_genres))
        .route("/genres", routing::delete(remove_genres))
        .route("/moods", routing::post(add_moods))
        .route("/moods", routing::delete(remove_moods))
        .layer(permission_required!(
            crate::auth::users::Backend,
            "administrator"
        ))
}

/// Submit new song
#[utoipa::path(
    post,
    path = "/api/protected/song",
    request_body(
        content = SubmitSong,
        content_type = "application/Json",
        example = json!({
            "name": "song_name",
            "price": "3000.0",
            "primary_genre": "абстрактный",
            "secondary_genre":"свинг",
            "sex": "Male",
            "tempo": 100,
            "key": "a_minor",
            "duration": 300,
            "lyric": "Some lyric...",
            "cover_object_key": "received/Josianne Koepp:1efe0ab0-9a85-4f94-ae62-237aa8b31c8b:image.png",
            "audio_object_key": "received/Josianne Koepp:1efe0ab0-9a85-4f94-ae62-237aa8b31c8e:song.mp3",
        }),
        
    ),
    responses(
        (status = 201, description = "Song submitted successfully"),
        (status = 403, response = ForbiddenResponse),
        (status = 500, response = InternalErrorResponse)
    ),
    security(
        ("api_key" = [])
    ),
    tag = "protected.admins"
)]
#[tracing::instrument(name = "Submit new song", skip_all)]
async fn submit_song(
    auth_session: AuthSession,
    State(state): State<AppState>,
    Json(req): Json<SubmitSong>,
) -> Result<StatusCode, ResponseError> {
    let _admin = auth_session.user.ok_or(ResponseError::UnauthorizedError(
        anyhow::anyhow!("No such user in AuthSession!"),
    ))?;
    req.validate(&())?;
    let db_client = state
        .pg_pool
        .get()
        .await
        .context("Failed to get connection from postgres pool")
        .map_err(ResponseError::UnexpectedError)?;
    admin_access::insert_new_song()
        .bind(
            &db_client,
            &req.name,
            &req.price,
            &req.primary_genre,
            &req.secondary_genre,
            &req.sex.to_string(),
            &req.tempo,
            &req.key.into(),
            &req.duration,
            &req.lyric.as_ref(),
            &req.cover_object_key.as_ref(),
            &req.audio_object_key.as_ref(),
        )
        .await
        .context("Failed to insert song into pg")?;
    Ok(StatusCode::CREATED)
}

/// Update existing song
#[utoipa::path(
    put ,
    path = "/api/protected/song/{id}",
    request_body(
        content = SubmitSong,
        content_type = "application/Json",
        example = json!({
            "name": "song_name",
            "price": "3000.0",
            "primary_genre": "абстрактный",
            "secondary_genre":"свинг",
            "sex": "Male",
            "tempo": 100,
            "key": "a_minor",
            "duration": 300,
            "lyric": "Some lyric...",
            "cover_object_key": "received/Josianne Koepp:1efe0ab0-9a85-4f94-ae62-237aa8b31c8b:image.png",
            "audio_object_key": "received/Josianne Koepp:1efe0ab0-9a85-4f94-ae62-237aa8b31c8e:song.mp3",
        }),
        
    ),
    responses(
        (status = 200, description = "Song updated successfully"),
        (status = 403, response = ForbiddenResponse),
        (status = 404, response = NotFoundResponse),
        (status = 500, response = InternalErrorResponse)
    ),
    security(
        ("api_key" = [])
    ),
    tag = "protected.admins"
)]
#[tracing::instrument(name = "Update song", skip_all)]
async fn update_song(
    auth_session: AuthSession,
    State(state): State<AppState>,
    Path(id): Path<i32>,
    Json(req): Json<SubmitSong>,
) -> Result<StatusCode, ResponseError> {
    let _admin = auth_session.user.ok_or(ResponseError::UnauthorizedError(
        anyhow::anyhow!("No such user in AuthSession!"),
    ))?;
    req.validate(&())?;
    let db_client = state
        .pg_pool
        .get()
        .await
        .context("Failed to get connection from postgres pool")
        .map_err(ResponseError::UnexpectedError)?;
    let obj_keys = admin_access::get_song_object_keys_by_id().bind(&db_client, &id).one().await
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
        })?;
    if obj_keys.cover_object_key.ne(req.cover_object_key.as_ref()) {
        trace_err!(state.object_storage.delete_object_by_key(&req.cover_object_key).await, ());
    }
    if obj_keys.audio_object_key.ne(req.audio_object_key.as_ref()) {
        trace_err!(state.object_storage.delete_object_by_key(&req.audio_object_key).await, ());
    }
    admin_access::update_song()
        .bind(
            &db_client,
            &req.name,
            &req.price,
            &req.primary_genre,
            &req.secondary_genre,
            &req.sex.to_string(),
            &req.tempo,
            &req.key.into(),
            &req.duration,
            &req.lyric.as_ref(),
            &req.cover_object_key.as_ref(),
            &req.audio_object_key.as_ref(),
            &id
        )
        .await
        .context("Failed to update song in pg")?;
    Ok(StatusCode::OK)
}

/// Remove existing song
#[utoipa::path(
    delete,
    path = "/api/protected/song/{id}",
    responses(
        (status = 200, description = "Song deleted successfully"),
        (status = 403, response = ForbiddenResponse),
        (status = 404, response = NotFoundResponse),
        (status = 500, response = InternalErrorResponse)
    ),
    security(
        ("api_key" = [])
    ),
    tag = "protected.admins"
)]
#[tracing::instrument(name = "Delete song by id", skip_all)]
async fn remove_song(
    auth_session: AuthSession,
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> Result<StatusCode, ResponseError> {
    let _admin = auth_session.user.ok_or(ResponseError::UnauthorizedError(
        anyhow::anyhow!("No such user in AuthSession!"),
    ))?;
    let db_client = state
        .pg_pool
        .get()
        .await
        .context("Failed to get connection from postgres pool")
        .map_err(ResponseError::UnexpectedError)?;
    let song = admin_access::remove_song_by_id()
        .bind(&db_client, &id)
        .opt()
        .await
        .context("Failed to remove song by id")?;
    if let Some(song) = song {
        if let Ok(key) = trace_err!(song.cover_object_key.parse()) {
            trace_err!(state.object_storage.delete_object_by_key(&key).await, ());
        }
        if let Ok(key) = trace_err!(song.cover_object_key.parse()) {
            trace_err!(state.object_storage.delete_object_by_key(&key).await, ());
        }
        Ok(StatusCode::OK)
    } else {
        Err(ResponseError::NotFoundError(anyhow::anyhow!("No song with id: {id}"), "Song not found"))
    }
}

/// Request presigned upload form
#[utoipa::path(
    get,
    path = "/api/protected/upload_form",
    params(UploadFileRequest),
    responses(
        (status = 200, description = "Song deleted successfully"),
        (status = 403, response = ForbiddenResponse),
        (status = 404, response = NotFoundResponse),
        (status = 500, response = InternalErrorResponse)
    ),
    security(
        ("api_key" = [])
    ),
    tag = "protected.admins"
    
)]
#[tracing::instrument(name = "Request presigned upload form", skip_all)]
async fn upload_form(
    auth_session: AuthSession,
    State(state): State<AppState>,
    Query(req): Query<UploadFileRequest>,
) -> Result<Json<PresignedPostData>, ResponseError> {
    let admin = auth_session.user.ok_or(ResponseError::UnauthorizedError(
        anyhow::anyhow!("No such user in AuthSession!"),
    ))?;
    req.validate(&())?;
    let max_size = match MAX_SIZES.get(&req.media_type) {
        Some(&max_size) => max_size,
        None => {
            tracing::warn!("Wrong media type: {}", req.media_type);
            return Err(ResponseError::UnsupportedMediaTypeError);
        }
    };

    let object_key = ObjectKey::new(
        "received",
        &admin.username,
        uuid::Uuid::new_v4(),
        &req.file_name,
    )
    .context("Failed to build object key")
    .map_err(ResponseError::BadRequest)?;

    let presigned_post_data = state
        .object_storage
        .generate_presigned_post_form(&object_key, req.media_type, max_size)?;

    Ok(Json(presigned_post_data))
}

/// Add new genres
#[utoipa::path(
    post,
    path = "/api/protected/genres",
    request_body(
        content = Vec<String>, description = "Json array with genres to add", content_type = "application/json"
    ),
    responses(
        (status = 200, description = "Inserted genres successfully"),
        (status = 403, response = ForbiddenResponse),
        (status = 500, response = InternalErrorResponse)
    ),
    security(
        ("api_key" = [])
    ),
    tag = "protected.admins"
    
)]
#[tracing::instrument(name = "Add genres", skip_all)]
async fn add_genres(
    State(state): State<AppState>,
    Json(genres): Json<Vec<String>>,
) -> Result<StatusCode, ResponseError> {
    let db_client = state
        .pg_pool
        .get()
        .await
        .context("Failed to get connection from postgres pool")
        .map_err(ResponseError::UnexpectedError)?;

    for genre in genres {
        admin_access::insert_genre().bind(&db_client, &genre).await.context("Failed to insert genre")?;
    } 
    Ok(StatusCode::OK)
}

/// Remove existing genres
#[utoipa::path(
    delete,
    path = "/api/protected/genres",
    request_body(
        content = Vec<String>, description = "Json array with genres to remove", content_type = "application/json"
    ),
    responses(
        (status = 200, description = "Removed genres successfully"),
        (status = 403, response = ForbiddenResponse),
        (status = 500, response = InternalErrorResponse)
    ),
    security(
        ("api_key" = [])
    ),
    tag = "protected.admins"
    
)]
#[tracing::instrument(name = "Delete genres", skip_all)]
async fn remove_genres(
    State(state): State<AppState>,
    Json(genres): Json<Vec<String>>,
) -> Result<StatusCode, ResponseError> {
    let db_client = state
        .pg_pool
        .get()
        .await
        .context("Failed to get connection from postgres pool")
        .map_err(ResponseError::UnexpectedError)?;

    for genre in genres {
        admin_access::remove_genre().bind(&db_client, &genre).await.context("Failed to remove genre")?;
    } 
    Ok(StatusCode::OK)
}

/// Add new moods
#[utoipa::path(
    post,
    path = "/api/protected/moods",
    request_body(
        content = Vec<String>, description = "Json array with moods to add", content_type = "application/json"
    ),
    responses(
        (status = 200, description = "Inserted moods successfully"),
        (status = 403, response = ForbiddenResponse),
        (status = 500, response = InternalErrorResponse)
    ),
    security(
        ("api_key" = [])
    ),
    tag = "protected.admins"
    
)]
#[tracing::instrument(name = "Add moods", skip_all)]
async fn add_moods(
    State(state): State<AppState>,
    Json(moods): Json<Vec<String>>,
) -> Result<StatusCode, ResponseError> {
    let db_client = state
        .pg_pool
        .get()
        .await
        .context("Failed to get connection from postgres pool")
        .map_err(ResponseError::UnexpectedError)?;

    for mood in moods{
        admin_access::insert_mood().bind(&db_client, &mood).await.context("Failed to insert genre")?;
    } 
    Ok(StatusCode::OK)
}

/// Remove existing moods
#[utoipa::path(
    delete,
    path = "/api/protected/moods",
    request_body(
        content = Vec<String>, description = "Json array with moods to remove", content_type = "application/json"
    ),
    responses(
        (status = 200, description = "Removed moods successfully"),
        (status = 403, response = ForbiddenResponse),
        (status = 500, response = InternalErrorResponse)
    ),
    security(
        ("api_key" = [])
    ),
    tag = "protected.admins"
    
)]
#[tracing::instrument(name = "Remove moods", skip_all)]
async fn remove_moods(
    State(state): State<AppState>,
    Json(moods): Json<Vec<String>>,
) -> Result<StatusCode, ResponseError> {
    let db_client = state
        .pg_pool
        .get()
        .await
        .context("Failed to get connection from postgres pool")
        .map_err(ResponseError::UnexpectedError)?;

    for mood in moods{
        admin_access::remove_mood().bind(&db_client, &mood).await.context("Failed to remove mood")?;
    } 
    Ok(StatusCode::OK)
}
