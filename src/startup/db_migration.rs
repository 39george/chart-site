use std::ops::DerefMut;

use refinery::embed_migrations;

use crate::helpers::generic_pg::PgPool;

embed_migrations!("./migrations");

pub async fn run_migration(pool: &PgPool) {
    let mut p_c = pool
        .get()
        .await
        .expect("Failed to get a connection from pg pool");
    let client = p_c.deref_mut();

    let report = match migrations::runner().run_async(client).await {
        Ok(r) => r,
        Err(e) => {
            tracing::warn!("Can't run migration on db: {}", e);
            return;
        }
    };

    if report.applied_migrations().is_empty() {
        tracing::info!("No migrations applied");
    }

    for migration in report.applied_migrations() {
        tracing::info!("Migration: {}", migration);
    }
}
