use std::{
    fs::File,
    io::{BufReader, Read},
};

use chart_site::{
    config::Settings,
    cornucopia::queries::open_access,
    domain::{
        music_parameters::{MusicKey, Sex},
        requests::{Lyric, SubmitSong},
    },
};
use rust_decimal::{prelude::FromPrimitive, Decimal};

use super::helpers::TestApp;

#[tokio::test]
async fn submit_song_success() {
    let config = Settings::load_configuration().unwrap();
    let app = TestApp::spawn_app(config).await;
    let http_client = reqwest::Client::builder()
        .cookie_store(true)
        .build()
        .unwrap();

    let admin = app.new_admin().await.unwrap();
    assert_eq!(app.login_admin(&admin, &http_client).await.as_u16(), 200);
    let cover = read_file("assets/Cover.png").unwrap();
    let song = read_file("assets/Song.mp3").unwrap();
    let (response, cover_obj_key) = app
        .upload_file_get_objkey(&http_client, "image/png", "Cover.png", cover)
        .await;
    assert_eq!(response.status().as_u16(), 200);
    let (response, song_obj_key) = app
        .upload_file_get_objkey(&http_client, "audio/mpeg", "Song.mp3", song)
        .await;
    assert_eq!(response.status().as_u16(), 200);

    let response = http_client
        .post(format!("{}/api/protected/song", &app.address))
        .json(&SubmitSong {
            name: "Lalasong".to_string(),
            price: Decimal::from_usize(1000).unwrap(),
            primary_genre: "поп".to_string(),
            secondary_genre: None,
            sex: Sex::Male,
            tempo: 100,
            key: MusicKey::a_major,
            duration: 60 * 3,
            lyric: Lyric("La la la".to_string()),
            cover_object_key: cover_obj_key.parse().unwrap(),
            audio_object_key: song_obj_key.parse().unwrap(),
        })
        .send()
        .await
        .unwrap();
    assert_eq!(response.status().as_u16(), 201);

    let songs = open_access::fetch_songs()
        .bind(&app.pg_client)
        .all()
        .await
        .unwrap();
    assert_eq!(songs.len(), 1);
    assert_eq!(&songs[0].song_name, "Lalasong");
}

fn read_file(name: &str) -> Result<Vec<u8>, std::io::Error> {
    let mut file = BufReader::new(File::open(name)?);
    let mut result = Vec::new();
    file.read_to_end(&mut result)?;
    Ok(result)
}
