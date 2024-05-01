use chart_site::{config::Settings, routes::session::ThemeValue};

use super::helpers::TestApp;

#[tokio::test]
async fn store_retrieve_theme_value_success() {
    // Create app
    let config = Settings::load_configuration().unwrap();
    let app = TestApp::spawn_app(config).await;
    let http_client = reqwest::Client::builder()
        .cookie_store(true)
        .build()
        .unwrap();

    // Get default theme
    let path = format!("{}/api/session/theme", app.address);
    let theme: Result<ThemeValue, _> =
        http_client.get(&path).send().await.unwrap().json().await;
    assert!(theme.is_ok_and(|v| v.eq(&ThemeValue::White)));

    // Set new theme
    assert_eq!(
        http_client
            .put(&path)
            .json(&ThemeValue::Dark)
            .send()
            .await
            .unwrap()
            .status()
            .as_u16(),
        200
    );

    // Get updated theme
    let theme: Result<ThemeValue, _> =
        http_client.get(&path).send().await.unwrap().json().await;
    assert!(theme.is_ok_and(|v| v.eq(&ThemeValue::Dark)));
}
