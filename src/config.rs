//! src/config.rs

use std::{net::Ipv4Addr, path::Path};

use anyhow::Context;
use config::FileFormat;
use secrecy::{ExposeSecret, Secret};
use serde::Deserialize;

#[derive(Deserialize, Debug, Clone, PartialEq, Eq)]
pub enum Environment {
    Dev,
    Prod,
}

#[derive(Deserialize, Debug)]
pub struct Settings {
    pub database: DatabaseSettings,
    pub redis: RedisSettings,
    pub app_port: u16,
    pub app_addr: Ipv4Addr,
    pub app_base_url: String,
    pub object_storage: ObjectStorageSettings,
    #[serde(default = "get_environment")]
    pub env: Environment,
}

impl Settings {
    pub fn load_configuration() -> Result<Settings, anyhow::Error> {
        let config_file = std::env::var("APP_CONFIG_FILE")
            .expect("APP_CONFIG_FILE var is unset!");

        config::Config::builder()
            .add_source(config::File::new(&config_file, FileFormat::Yaml))
            .build()?
            .try_deserialize()
            .context("Failed to build config from local config file.")
    }
}

#[derive(Deserialize, Debug, Clone)]
pub struct DatabaseSettings {
    pub host: String,
    #[serde(default = "pg_username")]
    pub username: String,
    #[serde(default = "pg_password")]
    pub password: Secret<String>,
    #[serde(default = "pg_db_name")]
    pub database_name: String,
}

impl DatabaseSettings {
    pub fn connection_string(&self) -> secrecy::Secret<String> {
        secrecy::Secret::new(format!(
            "user={} password={} dbname={} host={} application_name={}",
            self.username,
            self.password.expose_secret(),
            self.database_name,
            self.host,
            "zero2prod"
        ))
    }
}

#[derive(Deserialize, Debug, Clone)]
pub struct RedisSettings {
    pub host: String,
    pub port: u16,
    pub db_number: u16,
    #[serde(default = "redis_password")]
    pub password: Secret<String>,
}

impl RedisSettings {
    pub fn connection_string(&self) -> secrecy::Secret<String> {
        secrecy::Secret::new(format!(
            "redis://:{}@{}:{}/{}",
            self.password.expose_secret(),
            self.host,
            self.port,
            self.db_number
        ))
    }
}

#[derive(Clone, Debug, Deserialize)]
pub struct ObjectStorageSettings {
    pub api_endpoint: String,
    pub region: String,
    pub bucket_name: String,
    #[serde(default = "object_storage_key_id")]
    pub access_key_id: Secret<String>,
    #[serde(default = "object_storage_access_key")]
    pub secret_access_key: Secret<String>,
}

fn load_value_from_file<T: AsRef<Path>>(
    path: T,
) -> Result<String, std::io::Error> {
    Ok(std::fs::read_to_string(path)?.trim().to_string())
}

fn pg_username() -> String {
    std::env::var("POSTGRES_USER").expect("POSTGRES_USER var is unset!")
}

fn pg_db_name() -> String {
    std::env::var("POSTGRES_DB").expect("POSTGRES_DB var is unset!")
}

fn pg_password() -> Secret<String> {
    Secret::new(
        load_value_from_file(
            std::env::var("POSTGRES_PASSWORD_FILE")
                .expect("POSTGRES_PASSWORD_FILE var is unset!"),
        )
        .expect("Can't read postgres password file!"),
    )
}

fn redis_password() -> Secret<String> {
    Secret::new(
        load_value_from_file(
            std::env::var("REDIS_PASSWORD_FILE")
                .expect("REDIS_PASSWORD_FILE var is unset!"),
        )
        .expect("Can't read redis password file!"),
    )
}

fn object_storage_key_id() -> Secret<String> {
    Secret::new(
        load_value_from_file(
            std::env::var("OBJECT_STORAGE_KEY_ID_FILE")
                .expect("OBJECT_STORAGE_KEY_ID_FILE var is unset!"),
        )
        .expect("Can't read object-storage-key-id file!"),
    )
}

fn object_storage_access_key() -> Secret<String> {
    Secret::new(
        load_value_from_file(
            std::env::var("OBJECT_STORAGE_ACCESS_KEY_FILE")
                .expect("OBJECT_STORAGE_ACCESS_KEY_FILE var is unset!"),
        )
        .expect("Can't read object-storage-access-key file!"),
    )
}

fn get_environment() -> Environment {
    match std::env::var("ENVIRONMENT") {
        Ok(env) if env.eq("production") => Environment::Prod,
        _ => Environment::Dev,
    }
}
