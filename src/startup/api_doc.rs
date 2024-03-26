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

use crate::auth::users::Permission;
use crate::object_storage::presigned_post_form;
use crate::routes::development;
use crate::routes::open;

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
#[derive(ToResponse)]
#[response(
    description = "Not found some data (param name passed)",
    content_type = "application/json",
    example = json!({
        "param": "param_name" }),
)]
pub struct NotFoundResponse {
    _param: String,
}

#[derive(ToResponse)]
#[response(description = "Conflict error")]
pub struct ConflictErrorResponse;

// ───── Responses ────────────────────────────────────────────────────────── //

#[derive(ToSchema)]
#[schema(as = GetSongsList)]
pub struct GetSongsListResponse {
    pub song_id: i32,
    pub created_at: time::OffsetDateTime,
    pub cover_url: String,
    pub name: String,
    pub author: String,
    pub likes: i64,
    pub listenings: i64,
    pub relevance_score: rust_decimal::Decimal,
    pub price: rust_decimal::Decimal,
    pub is_user_liked: Option<bool>,
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
        components(
            schemas(
                crate::auth::login::Credentials,
                crate::auth::login::Username,
                GetSongsListResponse,
                Password,
                MediaType,
                ObjectKey,
            ),
            responses(
                InternalErrorResponse,
                BadRequestResponse,
                NotAcceptableErrorResponse,
                UnauthorizedErrorResponse,
                crate::object_storage::presigned_post_form::PresignedPostData,
                Permission,
                NotFoundResponse,
                ConflictErrorResponse,
            )
        ),
        modifiers(&ServerAddon),
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
