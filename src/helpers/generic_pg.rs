use std::ops::{Deref, DerefMut};

use bb8::{Pool, PooledConnection};
use bb8_postgres::PostgresConnectionManager;
use native_tls::TlsConnector;
use tokio_postgres::NoTls;

#[derive(Clone, Debug)]
pub enum PgPool {
    Tls(Pool<PostgresConnectionManager<postgres_native_tls::MakeTlsConnector>>),
    NoTls(Pool<PostgresConnectionManager<NoTls>>),
}

type PCTls<'a> = PooledConnection<
    'a,
    PostgresConnectionManager<postgres_native_tls::MakeTlsConnector>,
>;

type PCNoTls<'a> = PooledConnection<'a, PostgresConnectionManager<NoTls>>;

pub enum PgConn<'a> {
    Tls(PCTls<'a>),
    NoTls(PCNoTls<'a>),
}

impl<'a> Deref for PgConn<'a> {
    type Target = tokio_postgres::Client;
    fn deref(&self) -> &Self::Target {
        match self {
            PgConn::Tls(pc) => pc.deref(),
            PgConn::NoTls(pc) => pc.deref(),
        }
    }
}

impl<'a> DerefMut for PgConn<'a> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        match self {
            PgConn::Tls(pc) => pc.deref_mut(),
            PgConn::NoTls(pc) => pc.deref_mut(),
        }
    }
}

impl PgPool {
    pub async fn new(
        conn_str: &str,
        use_tls: bool,
    ) -> Result<Self, anyhow::Error> {
        let min_idle = 10;
        let max_size = 15;
        let queue_strategy = bb8::QueueStrategy::Lifo;
        if use_tls {
            let connector = TlsConnector::builder().build()?;
            let connector =
                postgres_native_tls::MakeTlsConnector::new(connector);

            let manager =
                bb8_postgres::PostgresConnectionManager::new_from_stringlike(
                    conn_str, connector,
                )?;
            let pool = bb8::Pool::builder()
                .queue_strategy(queue_strategy)
                .min_idle(min_idle)
                .max_size(max_size)
                .build(manager)
                .await?;
            Ok(PgPool::Tls(pool))
        } else {
            let manager =
                bb8_postgres::PostgresConnectionManager::new_from_stringlike(
                    conn_str, NoTls,
                )?;
            let pool = bb8::Pool::builder()
                .queue_strategy(queue_strategy)
                .min_idle(min_idle)
                .max_size(max_size)
                .build(manager)
                .await?;
            Ok(PgPool::NoTls(pool))
        }
    }

    pub async fn get<'a>(&'a self) -> Result<PgConn<'a>, anyhow::Error> {
        let client = match self {
            PgPool::Tls(pool) => {
                let c = pool.get().await?;
                PgConn::Tls(c)
            }
            PgPool::NoTls(pool) => {
                let c = pool.get().await?;
                PgConn::NoTls(c)
            }
        };
        Ok(client)
    }
}

pub async fn get_postgres_connection(
    conn_str: &str,
    use_tls: bool,
) -> Result<tokio_postgres::Client, tokio_postgres::Error> {
    let client = if use_tls {
        let connector = TlsConnector::builder().build().unwrap();
        let connector = postgres_native_tls::MakeTlsConnector::new(connector);
        let (client, conn) =
            tokio_postgres::connect(conn_str, connector).await?;

        // The connection object performs the actual communication with the database,
        // so spawn it off to run on its own.
        tokio::spawn(async move {
            conn.await.unwrap();
        });
        client
    } else {
        let (client, conn) = tokio_postgres::connect(conn_str, NoTls).await?;
        tokio::spawn(async move {
            conn.await.unwrap();
        });
        client
    };
    Ok(client)
}
