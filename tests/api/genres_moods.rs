use chart_site::config::Settings;

use super::helpers::TestApp;

#[tokio::test]
async fn add_remove_genre_success() {
    // Create app
    let config = Settings::load_configuration().unwrap();
    let app = TestApp::spawn_app(config).await;
    let http_client = reqwest::Client::builder()
        .cookie_store(true)
        .build()
        .unwrap();

    // Create and login admin
    let admin = app.new_admin().await.unwrap();
    assert_eq!(app.login_admin(&admin, &http_client).await.as_u16(), 200);

    // Get genres closure
    let get_genres = || async {
        http_client
            .get(format!("{}/api/open/genres", app.address))
            .send()
            .await
            .unwrap()
            .json::<Vec<String>>()
            .await
            .unwrap()
    };

    // Submit new genre
    let response = http_client
        .post(format!("{}/api/protected/genres", app.address))
        .json(&vec!["newgenre"])
        .send()
        .await
        .unwrap();
    assert_eq!(response.status().as_u16(), 201);

    // Retrieve genres list
    let genres_list = get_genres().await;
    assert!(genres_list.contains(&"newgenre".to_string()));

    // Remove genre
    let response = http_client
        .delete(format!("{}/api/protected/genres", app.address))
        .json(&vec!["newgenre"])
        .send()
        .await
        .unwrap();
    assert_eq!(response.status().as_u16(), 200);

    // Retrieve genres list
    let genres_list = get_genres().await;
    assert!(!genres_list.contains(&"newgenre".to_string()));
}

#[tokio::test]
async fn add_remove_mood_success() {
    // Create app
    let config = Settings::load_configuration().unwrap();
    let app = TestApp::spawn_app(config).await;
    let http_client = reqwest::Client::builder()
        .cookie_store(true)
        .build()
        .unwrap();

    // Create and login admin
    let admin = app.new_admin().await.unwrap();
    assert_eq!(app.login_admin(&admin, &http_client).await.as_u16(), 200);

    // Get moods closure
    let get_moods = || async {
        http_client
            .get(format!("{}/api/open/moods", app.address))
            .send()
            .await
            .unwrap()
            .json::<Vec<String>>()
            .await
            .unwrap()
    };

    // Submit new mood
    let response = http_client
        .post(format!("{}/api/protected/moods", app.address))
        .json(&vec!["newmood"])
        .send()
        .await
        .unwrap();
    assert_eq!(response.status().as_u16(), 201);

    // Retrieve moods list
    let moods_list = get_moods().await;
    assert!(moods_list.contains(&"newmood".to_string()));

    // Remove mood
    let response = http_client
        .delete(format!("{}/api/protected/moods", app.address))
        .json(&vec!["newmood"])
        .send()
        .await
        .unwrap();
    assert_eq!(response.status().as_u16(), 200);

    // Retrieve moods list
    let moods_list = get_moods().await;
    assert!(!moods_list.contains(&"newmood".to_string()));
}

#[tokio::test]
async fn fail_removing_referenced_genre_and_mood() {
    // Create app
    let config = Settings::load_configuration().unwrap();
    let app = TestApp::spawn_app(config).await;
    let http_client = reqwest::Client::builder()
        .cookie_store(true)
        .build()
        .unwrap();

    // Create and login admin
    assert_eq!(
        app.create_admin_submit_song(&http_client, "song").await,
        201
    );

    // Try to remove genre
    let response = http_client
        .delete(format!("{}/api/protected/genres", app.address))
        .json(&vec!["поп"])
        .send()
        .await
        .unwrap();
    assert_eq!(response.status().as_u16(), 422);

    // Try to remove mood
    let response = http_client
        .delete(format!("{}/api/protected/moods", app.address))
        .json(&vec!["веселый"])
        .send()
        .await
        .unwrap();
    assert_eq!(response.status().as_u16(), 422);
}
