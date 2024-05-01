//! We specify 400 BadRequest response in openapi documentation
//! only when we can particularly return that. For example, on validation error.

use std::collections::HashMap;

use axum::body::Body;
use axum::response::IntoResponse;
use axum::response::Response;
use http::StatusCode;
use mediatype::media_type;
use mediatype::MediaTypeBuf;

use crate::auth::AuthError;
use crate::impl_debug;
use crate::object_storage::ObjectStorageError;
use crate::types::data_size::DataSizes;

pub mod development;
pub mod open;
pub mod protected;
pub mod session;

// ───── Types ────────────────────────────────────────────────────────────── //

// Define the static variable MAX_SIZES for acceptable media types.
lazy_static::lazy_static! {
    pub static ref MAX_SIZES: HashMap<MediaTypeBuf, u64> = {
        let mut m = HashMap::new();
        m.insert(media_type!(IMAGE/PNG).into(), crate::MAX_IMAGE_SIZE_MB.mb_to_bytes());
        m.insert(media_type!(IMAGE/JPEG).into(), crate::MAX_IMAGE_SIZE_MB.mb_to_bytes());
        m.insert(media_type!(AUDIO/WAV).into(), crate::MAX_WAV_SIZE_MB.mb_to_bytes());
        m.insert(media_type!(AUDIO/MPEG).into(), crate::MAX_MP3_SIZE_MB.mb_to_bytes());
        m.insert(media_type!(APPLICATION/ZIP).into(), crate::MAX_MULTITRACK_SIZE_GB.gb_to_bytes());
        m.insert(media_type!(VIDEO/MP4).into(), crate::MAX_VIDEO_SIZE_MB.mb_to_bytes());
        m.insert(media_type!(APPLICATION/PDF).into(), crate::MAX_DOCUMENT_SIZE_MB.mb_to_bytes());
        m.insert(
            media_type!(APPLICATION/vnd::OPENXMLFORMATS_OFFICEDOCUMENT_WORDPROCESSINGML_DOCUMENT).into(),
            crate::MAX_DOCUMENT_SIZE_MB.mb_to_bytes(),
        );
        m
    };
}

#[derive(thiserror::Error)]
pub enum ResponseError {
    #[error(transparent)]
    ObjectStorageError(#[from] ObjectStorageError),
    #[error(transparent)]
    UnexpectedError(#[from] anyhow::Error),
    #[error("Internal error")]
    InternalError(#[source] anyhow::Error),
    #[error("Bad request")]
    BadRequest(#[source] anyhow::Error),
    #[error("Validation failed")]
    ValidationError(#[from] garde::Report),
    #[error("Can't process that input")]
    UnsupportedMediaTypeError,
    #[error("No such user")]
    UnauthorizedError(#[source] anyhow::Error),
    #[error("Too many uploads for that user")]
    TooManyUploadsError,
    #[error("Authentication error")]
    AuthError(#[from] AuthError),
    /// Source error is for internal debug, and static str is for response
    #[error("Not found error")]
    NotFoundError(#[source] anyhow::Error, &'static str),
    #[error("Have no access")]
    ForbiddenError(#[source] anyhow::Error),
    #[error("Conflict error")]
    ConflictError(#[source] anyhow::Error),
    #[error("Unprocessable entity")]
    UnprocessableError,
}

impl_debug!(ResponseError);

impl IntoResponse for ResponseError {
    fn into_response(self) -> Response {
        tracing::error!("{:?}", self);
        match self {
            ResponseError::UnexpectedError(_)
            | ResponseError::ObjectStorageError(_) => {
                StatusCode::INTERNAL_SERVER_ERROR.into_response()
            }
            ResponseError::InternalError(_) => {
                StatusCode::INTERNAL_SERVER_ERROR.into_response()
            }
            // We use middleware to make json response from BadRequest
            ResponseError::BadRequest(e) => Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .body(Body::from(e.to_string()))
                .unwrap_or(StatusCode::BAD_REQUEST.into_response()),
            ResponseError::UnauthorizedError(_) => {
                StatusCode::UNAUTHORIZED.into_response()
            }
            ResponseError::UnsupportedMediaTypeError => Response::builder()
                .status(StatusCode::UNSUPPORTED_MEDIA_TYPE)
                .header("Content-Type", "application/json")
                .body(Body::from(format!(
                    "{{\"allowed_mediatypes\":{}}}",
                    serde_json::to_string(
                        &MAX_SIZES
                            .keys()
                            .map(|media| media.as_str())
                            .collect::<Vec<&str>>(),
                    )
                    .unwrap(),
                )))
                .unwrap_or(StatusCode::UNSUPPORTED_MEDIA_TYPE.into_response()),
            ResponseError::TooManyUploadsError => {
                StatusCode::TOO_MANY_REQUESTS.into_response()
            }
            ResponseError::ValidationError(e) => Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .body(Body::from(e.to_string()))
                .unwrap_or(StatusCode::BAD_REQUEST.into_response()),
            ResponseError::AuthError(e) => e.into_response(),
            ResponseError::NotFoundError(_, param) => Response::builder()
                .status(StatusCode::NOT_FOUND)
                .header("Content-Type", "application/json")
                .body(Body::from(format!("{{\"param\":\"{}\"}}", param)))
                .unwrap_or(StatusCode::NOT_FOUND.into_response()),
            ResponseError::ForbiddenError(_) => {
                StatusCode::FORBIDDEN.into_response()
            }
            ResponseError::ConflictError(_) => {
                StatusCode::CONFLICT.into_response()
            }
            ResponseError::UnprocessableError => {
                StatusCode::UNPROCESSABLE_ENTITY.into_response()
            }
        }
    }
}
