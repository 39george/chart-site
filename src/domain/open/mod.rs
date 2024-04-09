use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use time::OffsetDateTime;
use utoipa::{ToResponse, ToSchema};

use super::{
    music_parameters::{MusicKey, Sex},
    requests::Lyric,
};

/// Derived `Deserialize` for integration tests
#[derive(Serialize, Deserialize, ToResponse, ToSchema)]
#[response(description = "Song data")]
pub struct FetchSongs {
    pub id: i32,
    #[serde(with = "crate::iso_format")]
    pub created_at: OffsetDateTime,
    #[serde(with = "crate::iso_format")]
    pub updated_at: OffsetDateTime,
    pub rating: Option<i32>,
    pub price: Decimal,
    pub name: String,
    pub primary_genre: String,
    pub secondary_genre: Option<String>,
    pub cover_url: String,
    pub sex: Sex,
    pub tempo: i16,
    pub key: MusicKey,
    pub duration: i16,
    pub lyric: Lyric,
    pub moods: Vec<String>,
}

impl From<crate::cornucopia::queries::open_access::FetchSongs> for FetchSongs {
    fn from(
        value: crate::cornucopia::queries::open_access::FetchSongs,
    ) -> Self {
        let key = MusicKey::from(value.key);
        FetchSongs {
            id: value.id,
            created_at: value.created_at,
            updated_at: value.updated_at,
            rating: value.rating,
            price: value.price,
            name: value.name,
            primary_genre: value.primary_genre,
            secondary_genre: value.secondary_genre,
            cover_url: value.cover_url,
            // We are sure in our database
            sex: value.sex.parse().unwrap(),
            tempo: value.tempo,
            key: value.key.into(),
            duration: value.duration,
            lyric: Lyric(value.lyric),
            moods: value.moods,
        }
    }
}
