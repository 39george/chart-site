use anyhow::Context;
use axum::extract::Path;
use axum::Json;
use axum::{extract::State, routing, Router};
use axum_login::permission_required;
use garde::Validate;
use http::StatusCode;

use crate::auth::users::AuthSession;
use crate::cornucopia::queries::admin_access;
use crate::domain::object_key::ObjectKey;
use crate::domain::requests::{SubmitSong, UploadFileRequest};
use crate::object_storage::presigned_post_form::PresignedPostData;
use crate::startup::AppState;

use super::{ResponseError, MAX_SIZES};

pub fn protected_router() -> Router<AppState> {
    Router::new()
        .route("/song", routing::post(submit_song))
        .route("/song/:id", routing::delete(remove_song))
        .route("/upload", routing::post(upload_file))
        .layer(permission_required!(
            crate::auth::users::Backend,
            "administrator"
        ))
}

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
        (status = 403, description = "Forbidden"),
        (status = 500, description = "Something happened on the server, or provided id's were incorrect")
    ),
    security(
        ("api_key" = [])
    ),
    tag = "protected.admins"
    
)]
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

async fn upload_file(
    auth_session: AuthSession,
    State(state): State<AppState>,
    Json(req): Json<UploadFileRequest>,
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
