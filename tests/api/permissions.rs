use chart_site::config::Settings;

use super::helpers::TestApp;

#[tokio::test]
async fn access_to_protected_with_login_is_allowed() {
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

    let response = http_client
        .get(format!("{}/api/protected/health_check", app.address))
        .send()
        .await
        .unwrap();
    assert_eq!(response.status().as_u16(), 200);
}

#[tokio::test]
async fn access_to_protected_without_login_is_restricted() {
    // Create app
    let config = Settings::load_configuration().unwrap();
    let app = TestApp::spawn_app(config).await;
    let http_client = reqwest::Client::builder()
        .cookie_store(true)
        .build()
        .unwrap();

    let response = http_client
        .get(format!("{}/api/protected/health_check", app.address))
        .send()
        .await
        .unwrap();
    assert_eq!(response.status().as_u16(), 403);
}
