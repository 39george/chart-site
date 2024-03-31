use chart_site::{config::Settings, startup::api_doc::FetchSongs};

use super::helpers::TestApp;

#[tokio::test]
async fn get_song_audio_success() {
    // Create app
    let config = Settings::load_configuration().unwrap();
    let app = TestApp::spawn_app(config).await;
    let http_client = reqwest::Client::builder()
        .cookie_store(true)
        .build()
        .unwrap();

    assert_eq!(app.submit_song(&http_client, "NewSong").await, 201);

    let response = http_client
        .get(format!("{}/api/open/songs", &app.address))
        .send()
        .await
        .unwrap();
    let song_id = response
        .json::<Vec<FetchSongs>>()
        .await
        .unwrap()
        .into_iter()
        .find(|s| s.name.eq("NewSong"))
        .unwrap()
        .id;
    let audio_url = http_client
        .get(format!("{}/api/open/audio_url/{}", &app.address, song_id))
        .send()
        .await
        .unwrap()
        .text()
        .await
        .unwrap();
    let audio_bytes = http_client
        .get(audio_url)
        .send()
        .await
        .unwrap()
        .bytes()
        .await
        .unwrap();
    assert_eq!(audio_bytes.len(), 27166);
}
