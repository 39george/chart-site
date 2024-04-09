use anyhow::Context;
use axum::extract::{Path, Query};
use axum::Json;
use axum::{extract::State, routing, Router};
use axum_login::permission_required;
use deadpool_postgres::GenericClient;
use garde::Validate;
use http::StatusCode;
use anyhow::anyhow;
use tokio_postgres::error::SqlState;

use crate::auth::users::AuthSession;
use crate::cornucopia::queries::admin_access;
use crate::domain::object_key::ObjectKey;
use crate::domain::requests::{SubmitSong, UploadFileRequest, WordQuery};
use crate::object_storage::presigned_post_form::PresignedPostData;
use crate::startup::api_doc::{BadRequestResponse, ForbiddenResponse, InternalErrorResponse, NotFoundResponse, UnsupportedMediaTypeErrorResponse};
use crate::startup::AppState;
use crate::trace_err;

use super::{ResponseError, MAX_SIZES};

pub fn protected_router() -> Router<AppState> {
    Router::new()
        .route("/upload_form", routing::get(upload_form))
        .route("/song", routing::post(submit_song))
        .route("/song/:id", routing::delete(remove_song))
        .route("/song_meta/:id", routing::put(update_song_metadata))
        .route("/song_data/:id", routing::put(update_song_data))
        .route("/:what", routing::post(add_data))
        .route("/:what", routing::delete(remove_data))
        .route("/health_check", routing::get(|| async { StatusCode::OK }))
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
            "rating": null,
            "primary_genre": "абстрактный",
            "secondary_genre":"свинг",
            "sex": "male",
            "tempo": 100,
            "key": "a_minor",
            "duration": 300,
            "lyric": "Some lyric...",
            "cover_object_key": "received/Josianne Koepp:1efe0ab0-9a85-4f94-ae62-237aa8b31c8b:image.png",
            "audio_object_key": "received/Josianne Koepp:1efe0ab0-9a85-4f94-ae62-237aa8b31c8e:song.mp3",
            "moods": ["веселый"],
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
    _auth_session: AuthSession,
    State(state): State<AppState>,
    Json(req): Json<SubmitSong>,
) -> Result<StatusCode, ResponseError> {
    req.validate(&())?;
    let cover_object_key = req.cover_object_key.ok_or(
        ResponseError::BadRequest(anyhow!("No cover object key provided".to_string()))
    )?;
    let audio_object_key = req.audio_object_key.ok_or(
        ResponseError::BadRequest(anyhow!("No audio object key provided".to_string()))
    )?;
    let mut db_client = state
        .pg_pool
        .get()
        .await
        .context("Failed to get connection from postgres pool")
        .map_err(ResponseError::UnexpectedError)?;
    let trans = db_client.transaction().await.context("Failed to get transaction from pg")?;
    let id = admin_access::insert_new_song_get_id()
        .bind(
            &trans,
            &req.name,
            &req.price,
            &req.rating,
            &req.primary_genre,
            &req.secondary_genre,
            &req.sex.to_string(),
            &req.tempo,
            &req.key.into(),
            &req.duration,
            &req.lyric.as_ref(),
            &cover_object_key.as_ref(),
            &audio_object_key.as_ref(),
        )
        .one()
        .await
        .context("Failed to insert song into pg")?;

    for mood in req.moods {
        admin_access::add_mood_to_song()
            .bind(&trans, &id, &mood).await.context("Failed to insert mood to song")?;
    }

    trans.commit().await.context("Failed to commit pg transaction")?;
    Ok(StatusCode::CREATED)
}

/// Update song meta information
#[utoipa::path(
    put ,
    path = "/api/protected/song_meta/{id}",
    request_body(
        content = SubmitSong,
        content_type = "application/Json",
        example = json!({
            "name": "song_name",
            "price": "3000.0",
            "rating": null,
            "primary_genre": "абстрактный",
            "secondary_genre":"свинг",
            "sex": "male",
            "tempo": 100,
            "key": "a_minor",
            "duration": 300,
            "lyric": "Some lyric...",
            "moods": ["веселый"],
        }),
        
    ),
    responses(
        (status = 200, description = "Song metadata updated successfully"),
        (status = 403, response = ForbiddenResponse),
        (status = 404, response = NotFoundResponse),
        (status = 500, response = InternalErrorResponse)
    ),
    security(
        ("api_key" = [])
    ),
    tag = "protected.admins"
)]
#[tracing::instrument(name = "Update song metadata", skip(_auth_session, state, req))]
async fn update_song_metadata(
    _auth_session: AuthSession,
    State(state): State<AppState>,
    Path(id): Path<i32>,
    Json(req): Json<SubmitSong>,
) -> Result<StatusCode, ResponseError> {
    req.validate(&())?;
    let mut db_client = state
        .pg_pool
        .get()
        .await
        .context("Failed to get connection from postgres pool")
        .map_err(ResponseError::UnexpectedError)?;
    let trans = db_client.transaction().await.context("Failed to get transaction from pg")?;
    let update_count = admin_access::update_song_metadata()
        .bind(
            &trans,
            &req.name,
            &req.price,
            &req.rating,
            &req.primary_genre,
            &req.secondary_genre,
            &req.sex.to_string(),
            &req.tempo,
            &req.key.into(),
            &req.duration,
            &req.lyric.as_ref(),
            &id
        )
        .await
        .context("Failed to update song in pg")?;
    if update_count == 0 {
        return Err(ResponseError::NotFoundError(
            anyhow!("Update song metadata's update_count is 0"), "No song found with given id")
        );
    }
    admin_access::remove_moods_from_song()
        .bind(&trans, &id)
        .await
        .context("Failed to remove moods from song when was updating song metadata")?;
    for mood in req.moods {
        admin_access::add_mood_to_song()
            .bind(&trans, &id, &mood).await.context("Failed to insert mood to song")?;
    }
    trans.commit().await.context("Failed to commit pg transaction")?;
    Ok(StatusCode::OK)
}

/// Update song data (cover or audio)
#[utoipa::path(
    put ,
    path = "/api/protected/song_data/{id}",
    params(
        ("what", Query, description = "which type of data to update (cover or audio)")
    ),
    request_body(
        content = String,
        content_type = "plain/text",
        example = "received/Josianne Koepp:1efe0ab0-9a85-4f94-ae62-237aa8b31c8b:image.png",
    ),
    responses(
        (status = 200, description = "Song data updated successfully"),
        (status = 400, response = BadRequestResponse),
        (status = 403, response = ForbiddenResponse),
        (status = 500, response = InternalErrorResponse)
    ),
    security(
        ("api_key" = [])
    ),
    tag = "protected.admins"
)]
#[tracing::instrument(name = "Update song data", skip_all)]
async fn update_song_data(
    _auth_session: AuthSession,
    State(state): State<AppState>,
    Path(id): Path<i32>,
    Query(q): Query<WordQuery>,
    object_key: String,
) -> Result<StatusCode, ResponseError> {
    let _: ObjectKey = object_key.parse().context("Failed to parse object key").map_err(ResponseError::BadRequest)?;
    let db_client = state
        .pg_pool
        .get()
        .await
        .context("Failed to get connection from postgres pool")
        .map_err(ResponseError::UnexpectedError)?;
    let old_obj_key = match q.what.as_str() {
        "cover" => {
            let old = admin_access::get_song_cover_object_key_by_id()
                .bind(&db_client, &id).one().await.context("Failed")?;
            admin_access::update_song_cover()            
                .bind(&db_client, &object_key, &id)
            .await.context("Failed to update song cover object key")?;
            old
        }
        "audio" => {
            let old = admin_access::get_song_audio_object_key_by_id()
                .bind(&db_client, &id).one().await.context("Failed")?;
            admin_access::update_song_audio()            
                .bind(&db_client, &object_key, &id)
            .await.context("Failed to update song audio object key")?;
            old
        }
        _ => return Err(ResponseError::BadRequest(anyhow!("Only 'cover' and 'audio' are allowed")))
    };
    trace_err!(
        state.object_storage
            .delete_object_by_key(&old_obj_key.parse().unwrap()).await, ()
    );
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
    _auth_session: AuthSession,
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> Result<StatusCode, ResponseError> {
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
        if let Ok(key) = trace_err!(song.audio_object_key.parse()) {
            trace_err!(state.object_storage.delete_object_by_key(&key).await, ());
        }
        Ok(StatusCode::OK)
    } else {
        Err(ResponseError::NotFoundError(anyhow::anyhow!("No song with id: {id}"), "Song not found"))
    }
}

/// Request presigned post form
#[utoipa::path(
    get,
    path = "/api/protected/upload_form",
    params(UploadFileRequest),
    responses(
        (status = 200, description = "Presigned upload form created successfully"),
        (status = 403, response = ForbiddenResponse),
        (status = 404, response = NotFoundResponse),
        (status = 415, response = UnsupportedMediaTypeErrorResponse),
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

/// Add new genres or moods
#[utoipa::path(
    post,
    path = "/api/protected/{what}",
    request_body(
        content = Vec<String>, description = "Json array with data to add", content_type = "application/json"
    ),
    responses(
        (status = 201, description = "Inserted data successfully"),
        (status = 400, response = BadRequestResponse),
        (status = 403, response = ForbiddenResponse),
        (status = 500, response = InternalErrorResponse)
    ),
    security(
        ("api_key" = [])
    ),
    tag = "protected.admins"
    
)]
#[tracing::instrument(name = "Add data (genres or moods)", skip_all)]
async fn add_data(
    State(state): State<AppState>,
    Path(what): Path<String>,
    Json(data): Json<Vec<String>>,
) -> Result<StatusCode, ResponseError> {
    let db_client = state
        .pg_pool
        .get()
        .await
        .context("Failed to get connection from postgres pool")
        .map_err(ResponseError::UnexpectedError)?;

    match what.as_str() {
        "genres" => {
            for genre in data {
                admin_access::insert_genre().bind(&db_client, &genre).await.context("Failed to insert genre")?;
            } 
        }
        "moods" => {
            for mood in data{
                admin_access::insert_mood().bind(&db_client, &mood).await.context("Failed to insert genre")?;
            } 
        }
        _ => return Err(ResponseError::BadRequest(anyhow!("Only genres and moods available, given: {what}")))
    }

    Ok(StatusCode::CREATED)
}

/// Remove existing genres or moods
#[utoipa::path(
    delete,
    path = "/api/protected/{what}",
    request_body(
        content = Vec<String>, description = "Json array with data to remove", content_type = "application/json"
    ),
    responses(
        (status = 200, description = "Removed data successfully"),
        (status = 400, response = BadRequestResponse),
        (status = 403, response = ForbiddenResponse),
        (status = 422, description = "Your data is correct, but it causes reference violation with existing song"),
        (status = 500, response = InternalErrorResponse)
    ),
    security(
        ("api_key" = [])
    ),
    tag = "protected.admins"
    
)]
#[tracing::instrument(name = "Delete genres", skip_all)]
async fn remove_data(
    State(state): State<AppState>,
    Path(what): Path<String>,
    Json(data): Json<Vec<String>>,
) -> Result<StatusCode, ResponseError> {
    let db_client = state
        .pg_pool
        .get()
        .await
        .context("Failed to get connection from postgres pool")
        .map_err(ResponseError::UnexpectedError)?;

    let check = |result: Result<u64, tokio_postgres::Error>| match result {
        Ok(c) => Ok(c),
        Err(e) => {
            if e.as_db_error()
                .ok_or(ResponseError::UnexpectedError(anyhow!("{e}")))?
                .code()
                .eq(&SqlState::FOREIGN_KEY_VIOLATION)
            {
                return Err(ResponseError::UnprocessableError);
            } else {
                return Err(ResponseError::UnexpectedError(anyhow!("{e}")));
            }
        }
    };

    match what.as_str() {
        "genres" => {
            for genre in data {
                let count = check(
                    admin_access::remove_genre().bind(&db_client, &genre).await,
                )?;
                tracing::info!("Removed {} genres", count);
            }
        }
        "moods" => {
            for mood in data {
                let count = check(
                    admin_access::remove_mood().bind(&db_client, &mood).await,
                )?;
                tracing::info!("Removed {} moods", count);
            }
        }
        _ => {
            return Err(ResponseError::BadRequest(anyhow!(
                "Only genres and moods available, given: {what}"
            )))
        }
    }
    Ok(StatusCode::OK)
}
