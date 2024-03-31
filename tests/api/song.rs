use chart_site::{
    config::Settings,
    cornucopia::queries::open_access,
    domain::{
        music_parameters::{MusicKey, Sex},
        requests::{Lyric, SubmitSong},
    },
    startup::api_doc::FetchSongs,
};
use reqwest::Client;
use rust_decimal::{prelude::FromPrimitive, Decimal};

use super::helpers::read_file;
use super::helpers::TestApp;

impl TestApp {
    pub async fn submit_song(
        &self,
        http_client: &Client,
        song_name: &str,
    ) -> u16 {
        // Create and login admin
        let admin = self.new_admin().await.unwrap();
        assert_eq!(self.login_admin(&admin, &http_client).await.as_u16(), 200);

        // Upload cover and song
        let cover = read_file("assets/Cover.png").unwrap();
        let song = read_file("assets/Song.mp3").unwrap();
        let (response, cover_obj_key) = self
            .upload_file_get_objkey(
                &http_client,
                "image/png",
                "Cover.png",
                cover,
            )
            .await;
        assert_eq!(response.status().as_u16(), 200);
        let (response, song_obj_key) = self
            .upload_file_get_objkey(
                &http_client,
                "audio/mpeg",
                "Song.mp3",
                song,
            )
            .await;
        assert_eq!(response.status().as_u16(), 200);

        // Submit song
        let response = http_client
            .post(format!("{}/api/protected/song", &self.address))
            .json(&SubmitSong {
                name: song_name.to_string(),
                price: Decimal::from_usize(1000).unwrap(),
                primary_genre: "поп".to_string(),
                secondary_genre: None,
                sex: Sex::Male,
                tempo: 100,
                key: MusicKey::a_major,
                duration: 60 * 3,
                lyric: Lyric("La la la".to_string()),
                cover_object_key: Some(cover_obj_key.parse().unwrap()),
                audio_object_key: Some(song_obj_key.parse().unwrap()),
                rating: None,
            })
            .send()
            .await
            .unwrap();
        response.status().as_u16()
    }
}

#[tokio::test]
async fn submit_song_success() {
    // Create app
    let config = Settings::load_configuration().unwrap();
    let app = TestApp::spawn_app(config).await;
    let http_client = reqwest::Client::builder()
        .cookie_store(true)
        .build()
        .unwrap();
    assert_eq!(app.submit_song(&http_client, "Lalasong").await, 201);

    let response = http_client
        .get(format!("{}/api/open/songs", &app.address))
        .send()
        .await
        .unwrap();
    let songs: Vec<FetchSongs> = response.json().await.unwrap();
    assert_eq!(songs.len(), 1);
    assert_eq!(&songs[0].name, "Lalasong");
}

#[tokio::test]
async fn delete_song_success() {
    // Create app
    let config = Settings::load_configuration().unwrap();
    let app = TestApp::spawn_app(config).await;
    let http_client = reqwest::Client::builder()
        .cookie_store(true)
        .build()
        .unwrap();
    assert_eq!(app.submit_song(&http_client, "Lalasong").await, 201);

    let response = http_client
        .delete(format!("{}/api/protected/song/{}", &app.address, 1))
        .send()
        .await
        .unwrap();
    assert_eq!(response.status().as_u16(), 200);
}

#[tokio::test]
async fn rename_song_success() {
    // Create app
    let config = Settings::load_configuration().unwrap();
    let app = TestApp::spawn_app(config).await;
    let http_client = reqwest::Client::builder()
        .cookie_store(true)
        .build()
        .unwrap();
    // Create song
    assert_eq!(app.submit_song(&http_client, "Lalasong").await, 201);

    // Fetch song and rename it
    let mut song = http_client
        .get(format!("{}/api/open/songs", &app.address))
        .send()
        .await
        .unwrap()
        .json::<Vec<FetchSongs>>()
        .await
        .unwrap()
        .pop()
        .unwrap();
    song.name = String::from("Other name");

    // Send request to update song
    let response = http_client
        .put(format!("{}/api/protected/song_meta/{}", &app.address, 1))
        .json(&SubmitSong {
            name: song.name,
            price: song.price,
            primary_genre: song.primary_genre,
            secondary_genre: song.secondary_genre,
            sex: song.sex,
            tempo: song.tempo,
            key: song.key,
            duration: song.duration,
            lyric: song.lyric,
            cover_object_key: None,
            audio_object_key: None,
            rating: None,
        })
        .send()
        .await
        .unwrap();
    assert_eq!(response.status().as_u16(), 200);

    let song = http_client
        .get(format!("{}/api/open/songs", &app.address))
        .send()
        .await
        .unwrap()
        .json::<Vec<FetchSongs>>()
        .await
        .unwrap()
        .pop()
        .unwrap();
    assert_eq!(&song.name, "Other name");
}

#[tokio::test]
async fn update_song_audio_success() {
    // Create app
    let config = Settings::load_configuration().unwrap();
    let app = TestApp::spawn_app(config).await;
    let http_client = reqwest::Client::builder()
        .cookie_store(true)
        .build()
        .unwrap();

    // Fetch song closure
    let fetch_song = || async {
        http_client
            .get(format!("{}/api/open/songs", &app.address))
            .send()
            .await
            .unwrap()
            .json::<Vec<FetchSongs>>()
            .await
            .unwrap()
            .pop()
            .unwrap()
    };
    // Create song
    assert_eq!(app.submit_song(&http_client, "Lalasong").await, 201);

    // Upload new audio
    let song = read_file("assets/Song.mp3").unwrap();
    let (response, audio_obj_key) = app
        .upload_file_get_objkey(&http_client, "image/png", "NewSong.mp3", song)
        .await;
    assert_eq!(response.status().as_u16(), 200);

    let song = fetch_song().await;
    // Update song audio data
    let response = http_client
        .put(format!(
            "{}/api/protected/song_data/{}?what={}",
            &app.address, song.id, "audio"
        ))
        .body(audio_obj_key.clone())
        .send()
        .await
        .unwrap();
    assert_eq!(response.status().as_u16(), 200);

    // Retrieve audio obj key from db
    let obj_key = open_access::get_song_audio_obj_key_by_id()
        .bind(&app.pg_client, &song.id)
        .one()
        .await
        .unwrap();
    assert_eq!(audio_obj_key, obj_key);
}
