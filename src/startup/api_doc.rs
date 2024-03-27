//! We derive ToSchema to all types need to show their fields to frontend,
//! and derive ToResponse to all types we bind as `response = Type`.
//! We only need ToSchema derived if we set response as `body = Type`.

use utoipa::{
    openapi::{
        security::{ApiKey, ApiKeyValue, SecurityScheme},
        ServerBuilder,
    },
    Modify, OpenApi, ToResponse, ToSchema,
};

use crate::{auth::users::Permission, domain::music_parameters::MusicKey};
use crate::{
    domain::requests::SubmitSong, object_storage::presigned_post_form,
};
use crate::{domain::requests::UploadFileRequest, routes::open};
use crate::{
    domain::{music_parameters::Sex, requests::Lyric},
    routes::development,
};

// ───── ErrorResponses ───────────────────────────────────────────────────── //

#[derive(ToResponse)]
#[response(description = "Something happened on the server")]
pub struct InternalErrorResponse;

#[allow(dead_code)]
#[derive(ToResponse)]
#[response(
    description = "Request was formed erroneously",
    content_type = "application/json",
    example = json!({
        "caused_by":
        "Here will be the reason of a rejection"
    }),
)]
pub struct BadRequestResponse(String);

#[derive(ToResponse)]
#[response(description = "Not acceptable error")]
pub struct NotAcceptableErrorResponse;

#[allow(dead_code)]
#[derive(ToResponse)]
#[response(
    description = "Unauthorized error",
    content_type = "text/plain",
    example = json!({
        "caused_by":
        "Auth is required"
    }),
)]
pub struct UnauthorizedErrorResponse(String);

// We use ToSchema here, because we write manually in every case,
// inlined, description, examples etc.
#[allow(dead_code)]
#[derive(ToResponse)]
#[response(
    description = "Not found some data (param name passed)",
    content_type = "application/json",
    example = json!({
        "param": "param_name" }),
)]
pub struct NotFoundResponse {
    param: String,
}

#[derive(ToResponse)]
#[response(description = "Conflict error")]
pub struct ConflictErrorResponse;

// ───── Responses ────────────────────────────────────────────────────────── //

#[derive(ToSchema)]
#[schema(as = FetchSongs)]
pub struct FetchSongs {
    pub song_name: String,
    pub primary_genre: String,
    pub secondary_genre: String,
    pub sex: String,
    pub tempo: i16,
    pub key: MusicKey,
    pub duration: i16,
    pub lyric: String,
}

// ───── TypeWrappers ─────────────────────────────────────────────────────── //

#[allow(dead_code)]
#[derive(ToSchema)]
#[schema(as = Secret)]
pub struct Password(String);

#[allow(dead_code)]
#[derive(ToSchema)]
#[schema(as = mediatype::MediaTypeBuf)]
pub struct MediaType(String);

#[allow(dead_code)]
#[derive(ToSchema)]
#[schema(
    value_type = String,
    example = "received/Lisa:21C960E7-5CA8-4974-98D7-6501DCCCAFD7:file.ext"
)]
pub struct ObjectKey(String);

// ───── Addons ───────────────────────────────────────────────────────────── //

/// NOTE: We use security addon also as simple marker.
/// For example, endpoint is protected by cookie auth, we will mark
/// endpoint as secured with "api_key" = [].
struct SecurityAddon;

impl Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        if let Some(components) = openapi.components.as_mut() {
            components.add_security_scheme(
                "api_key",
                SecurityScheme::ApiKey(ApiKey::Cookie(ApiKeyValue::new("id"))),
            )
        }
    }
}

struct ServerAddon;

impl Modify for ServerAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        let server = ServerBuilder::new()
            .description(Some("Development server"))
            .build();
        openapi.servers = Some(vec![server]);
    }
}

// ───── Api ──────────────────────────────────────────────────────────────── //

#[derive(OpenApi)]
#[openapi(
    paths(
        crate::routes::protected::submit_song,
        crate::routes::protected::remove_song,
        crate::routes::protected::upload_form,
        crate::auth::login::post::login,
        crate::auth::login::get::logout,
    ),
    components(
        schemas(
            crate::auth::login::Credentials,
            crate::auth::login::Username,
            FetchSongs,
            Password,
            MediaType,
            ObjectKey,
            MusicKey,
            Lyric,
            Sex,
            SubmitSong,
            UploadFileRequest,
        ),
        responses(
            // Error responses
            InternalErrorResponse,
            BadRequestResponse,
            NotAcceptableErrorResponse,
            UnauthorizedErrorResponse,
            NotFoundResponse,
            ConflictErrorResponse,
            // Other responses
            crate::object_storage::presigned_post_form::PresignedPostData,
            Permission,
        )
    ),
    modifiers(&ServerAddon),
    modifiers(&SecurityAddon),
    tags(
        (name = "open", description = "Open routes (no authorization)"),
        (name = "protected.admins", description = "Protected routes for admins"),
        (name = "development", description = "Routes available only in development mode")
    ),
    info(
        title = "Chart site - OpenAPI 3.0",
        version = "0.1.0",
        description = "This is a swagger documentation for chart site backend application.",
    )
)]
pub(super) struct ApiDoc;
