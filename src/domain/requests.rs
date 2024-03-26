use garde::Validate;
use serde::{Deserialize, Serialize};
use utoipa::IntoParams;
use utoipa::ToSchema;

use super::contains_no_control_characters;
use super::forbidden_characters;
use super::music_parameters::{MusicKey, Sex};
use super::object_key::ObjectKey;
use super::{GENRE_MAX_LEN, GENRE_MIN_LEN, MAX_TEMPO, MIN_TEMPO};
use super::{MAX_AUDIO_DURATION_SEC, MIN_AUDIO_DURATION_SEC};
use super::{MAX_FILENAME_LEN, MIN_FILENAME_LEN};
use super::{MAX_LYRIC_LEN, MIN_LYRIC_LEN};

/// Lyric (text for song).
#[derive(Serialize, Deserialize, Debug, Validate, ToSchema)]
#[garde(transparent)]
pub struct Lyric(
    #[garde(
        length(min = MIN_LYRIC_LEN, max = MAX_LYRIC_LEN),
        custom(contains_no_control_characters)
    )]
    /// Should contain no control characters
    #[schema(example = "Some lyrics", min_length = 1, max_length = 5000)]
    String,
);

impl AsRef<str> for Lyric {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

#[derive(Deserialize, Validate, ToSchema)]
#[garde(allow_unvalidated)]
pub struct SubmitSong {
    #[garde(
        length(min=GENRE_MIN_LEN, max=GENRE_MAX_LEN),
        custom(forbidden_characters),
        custom(contains_no_control_characters)
    )]
    #[schema(example = "pop", pattern = r#"[^/()"<>\\{};:]*"#)]
    pub primary_genre: String,
    #[garde(
        length(min=GENRE_MIN_LEN, max=GENRE_MAX_LEN),
        inner(
            custom(forbidden_characters),
            custom(contains_no_control_characters)
        )
    )]
    #[schema(pattern = r#"[^/()"<>\\{};:]*"#)]
    pub secondary_genre: Option<String>,
    #[garde(skip)]
    pub sex: Sex,
    #[garde(range(min = MIN_TEMPO, max = MAX_TEMPO))]
    #[schema(minimum = 40, maximum = 320)]
    pub tempo: i16,
    pub key: MusicKey,
    #[garde(range(min = MIN_AUDIO_DURATION_SEC, max = MAX_AUDIO_DURATION_SEC))]
    #[schema(minimum = 15, maximum = 600)]
    pub duration: i16,
    #[garde(dive)]
    pub lyric: Lyric,
    pub cover_object_key: ObjectKey,
    pub audio_object_key: ObjectKey,
}

#[derive(Deserialize, Debug, Validate, ToSchema, IntoParams)]
pub struct UploadFileRequest {
    #[garde(skip)]
    pub media_type: mediatype::MediaTypeBuf,
    #[garde(
        length(min = MIN_FILENAME_LEN, max = MAX_FILENAME_LEN),
        custom(forbidden_characters),
        custom(contains_no_control_characters)
    )]
    #[param(min_length = 2, max_length = 50, pattern = r#"[^/()"<>\\{};:]*"#)]
    pub file_name: String,
}
