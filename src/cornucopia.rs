// This file was generated with `cornucopia`. Do not modify.

#[allow(clippy :: all, clippy :: pedantic)] #[allow(unused_variables)]
#[allow(unused_imports)] #[allow(dead_code)] pub mod types { pub mod public { #[derive(serde::Serialize, Debug, Clone, Copy, PartialEq, Eq)]
#[allow(non_camel_case_types)] pub enum Musickey { a_minor,a_major,b_flat_minor,b_flat_major,b_minor,b_major,c_minor,c_major,c_sharp_minor,c_sharp_major,d_minor,d_major,e_flat_minor,e_flat_major,e_minor,e_major,f_minor,f_major,f_sharp_minor,f_sharp_major,g_minor,g_major,a_flat_minor,a_flat_major,}impl < 'a > postgres_types :: ToSql for Musickey
{
    fn
    to_sql(& self, ty : & postgres_types :: Type, buf : & mut postgres_types
    :: private :: BytesMut,) -> Result < postgres_types :: IsNull, Box < dyn
    std :: error :: Error + Sync + Send >, >
    {
        let s = match * self { Musickey :: a_minor => "a_minor",Musickey :: a_major => "a_major",Musickey :: b_flat_minor => "b_flat_minor",Musickey :: b_flat_major => "b_flat_major",Musickey :: b_minor => "b_minor",Musickey :: b_major => "b_major",Musickey :: c_minor => "c_minor",Musickey :: c_major => "c_major",Musickey :: c_sharp_minor => "c_sharp_minor",Musickey :: c_sharp_major => "c_sharp_major",Musickey :: d_minor => "d_minor",Musickey :: d_major => "d_major",Musickey :: e_flat_minor => "e_flat_minor",Musickey :: e_flat_major => "e_flat_major",Musickey :: e_minor => "e_minor",Musickey :: e_major => "e_major",Musickey :: f_minor => "f_minor",Musickey :: f_major => "f_major",Musickey :: f_sharp_minor => "f_sharp_minor",Musickey :: f_sharp_major => "f_sharp_major",Musickey :: g_minor => "g_minor",Musickey :: g_major => "g_major",Musickey :: a_flat_minor => "a_flat_minor",Musickey :: a_flat_major => "a_flat_major",}
        ; buf.extend_from_slice(s.as_bytes()) ; std :: result :: Result ::
        Ok(postgres_types :: IsNull :: No)
    } fn accepts(ty : & postgres_types :: Type) -> bool
    {
        if ty.name() != "musickey" { return false ; } match * ty.kind()
        {
            postgres_types :: Kind :: Enum(ref variants) =>
            {
                if variants.len() != 24 { return false ; }
                variants.iter().all(| v | match & * * v
                { "a_minor" => true,"a_major" => true,"b_flat_minor" => true,"b_flat_major" => true,"b_minor" => true,"b_major" => true,"c_minor" => true,"c_major" => true,"c_sharp_minor" => true,"c_sharp_major" => true,"d_minor" => true,"d_major" => true,"e_flat_minor" => true,"e_flat_major" => true,"e_minor" => true,"e_major" => true,"f_minor" => true,"f_major" => true,"f_sharp_minor" => true,"f_sharp_major" => true,"g_minor" => true,"g_major" => true,"a_flat_minor" => true,"a_flat_major" => true,_ => false, })
            } _ => false,
        }
    } fn
    to_sql_checked(& self, ty : & postgres_types :: Type, out : & mut
    postgres_types :: private :: BytesMut,) -> Result < postgres_types ::
    IsNull, Box < dyn std :: error :: Error + Sync + Send >>
    { postgres_types :: __to_sql_checked(self, ty, out) }
} impl < 'a > postgres_types :: FromSql < 'a > for Musickey
{
    fn from_sql(ty : & postgres_types :: Type, buf : & 'a [u8],) -> Result <
    Musickey, Box < dyn std :: error :: Error + Sync + Send >, >
    {
        match std :: str :: from_utf8(buf) ?
        {
            "a_minor" => Ok(Musickey :: a_minor),"a_major" => Ok(Musickey :: a_major),"b_flat_minor" => Ok(Musickey :: b_flat_minor),"b_flat_major" => Ok(Musickey :: b_flat_major),"b_minor" => Ok(Musickey :: b_minor),"b_major" => Ok(Musickey :: b_major),"c_minor" => Ok(Musickey :: c_minor),"c_major" => Ok(Musickey :: c_major),"c_sharp_minor" => Ok(Musickey :: c_sharp_minor),"c_sharp_major" => Ok(Musickey :: c_sharp_major),"d_minor" => Ok(Musickey :: d_minor),"d_major" => Ok(Musickey :: d_major),"e_flat_minor" => Ok(Musickey :: e_flat_minor),"e_flat_major" => Ok(Musickey :: e_flat_major),"e_minor" => Ok(Musickey :: e_minor),"e_major" => Ok(Musickey :: e_major),"f_minor" => Ok(Musickey :: f_minor),"f_major" => Ok(Musickey :: f_major),"f_sharp_minor" => Ok(Musickey :: f_sharp_minor),"f_sharp_major" => Ok(Musickey :: f_sharp_major),"g_minor" => Ok(Musickey :: g_minor),"g_major" => Ok(Musickey :: g_major),"a_flat_minor" => Ok(Musickey :: a_flat_minor),"a_flat_major" => Ok(Musickey :: a_flat_major),s => Result ::
            Err(Into :: into(format! ("invalid variant `{}`", s))),
        }
    } fn accepts(ty : & postgres_types :: Type) -> bool
    {
        if ty.name() != "musickey" { return false ; } match * ty.kind()
        {
            postgres_types :: Kind :: Enum(ref variants) =>
            {
                if variants.len() != 24 { return false ; }
                variants.iter().all(| v | match & * * v
                { "a_minor" => true,"a_major" => true,"b_flat_minor" => true,"b_flat_major" => true,"b_minor" => true,"b_major" => true,"c_minor" => true,"c_major" => true,"c_sharp_minor" => true,"c_sharp_major" => true,"d_minor" => true,"d_major" => true,"e_flat_minor" => true,"e_flat_major" => true,"e_minor" => true,"e_major" => true,"f_minor" => true,"f_major" => true,"f_sharp_minor" => true,"f_sharp_major" => true,"g_minor" => true,"g_major" => true,"a_flat_minor" => true,"a_flat_major" => true,_ => false, })
            } _ => false,
        }
    }
} }}#[allow(clippy :: all, clippy :: pedantic)] #[allow(unused_variables)]
#[allow(unused_imports)] #[allow(dead_code)] pub mod queries
{ pub mod admin_access
{ use futures::{{StreamExt, TryStreamExt}};use futures; use cornucopia_async::GenericClient;#[derive( Debug)] pub struct InsertNewSongParams < T1 : cornucopia_async::StringSql,T2 : cornucopia_async::StringSql,T3 : cornucopia_async::StringSql,T4 : cornucopia_async::StringSql,T5 : cornucopia_async::StringSql,T6 : cornucopia_async::StringSql,T7 : cornucopia_async::StringSql,> { pub name : T1,pub price : rust_decimal::Decimal,pub primary_genre : T2,pub secondary_genre : Option<T3>,pub sex : T4,pub tempo : i16,pub key : super::super::types::public::Musickey,pub duration : i16,pub lyric : T5,pub cover_obj_key : T6,pub audio_obj_key : T7,}#[derive( Debug)] pub struct UpdateSongParams < T1 : cornucopia_async::StringSql,T2 : cornucopia_async::StringSql,T3 : cornucopia_async::StringSql,T4 : cornucopia_async::StringSql,T5 : cornucopia_async::StringSql,T6 : cornucopia_async::StringSql,T7 : cornucopia_async::StringSql,> { pub name : T1,pub price : rust_decimal::Decimal,pub primary_genre : T2,pub secondary_genre : Option<T3>,pub sex : T4,pub tempo : i16,pub key : super::super::types::public::Musickey,pub duration : i16,pub lyric : T5,pub cover_object_key : T6,pub audio_object_key : T7,pub id : i32,}#[derive(serde::Serialize, Debug, Clone, PartialEq, )] pub struct GetSongObjectKeysById
{ pub cover_object_key : String,pub audio_object_key : String,}pub struct GetSongObjectKeysByIdBorrowed < 'a >
{ pub cover_object_key : &'a str,pub audio_object_key : &'a str,} impl < 'a > From < GetSongObjectKeysByIdBorrowed <
'a >> for GetSongObjectKeysById
{
    fn
    from(GetSongObjectKeysByIdBorrowed { cover_object_key,audio_object_key,} : GetSongObjectKeysByIdBorrowed < 'a >)
    -> Self { Self { cover_object_key: cover_object_key.into(),audio_object_key: audio_object_key.into(),} }
}pub struct GetSongObjectKeysByIdQuery < 'a, C : GenericClient, T, const N : usize >
{
    client : & 'a  C, params :
    [& 'a (dyn postgres_types :: ToSql + Sync) ; N], stmt : & 'a mut cornucopia_async
    :: private :: Stmt, extractor : fn(& tokio_postgres :: Row) -> GetSongObjectKeysByIdBorrowed,
    mapper : fn(GetSongObjectKeysByIdBorrowed) -> T,
} impl < 'a, C, T : 'a, const N : usize > GetSongObjectKeysByIdQuery < 'a, C, T, N >
where C : GenericClient
{
    pub fn map < R > (self, mapper : fn(GetSongObjectKeysByIdBorrowed) -> R) -> GetSongObjectKeysByIdQuery
    < 'a, C, R, N >
    {
        GetSongObjectKeysByIdQuery
        {
            client : self.client, params : self.params, stmt : self.stmt,
            extractor : self.extractor, mapper,
        }
    } pub async fn one(self) -> Result < T, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let row =
        self.client.query_one(stmt, & self.params) .await ? ;
        Ok((self.mapper) ((self.extractor) (& row)))
    } pub async fn all(self) -> Result < Vec < T >, tokio_postgres :: Error >
    { self.iter() .await ?.try_collect().await } pub async fn opt(self) -> Result
    < Option < T >, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ;
        Ok(self.client.query_opt(stmt, & self.params) .await
        ?.map(| row | (self.mapper) ((self.extractor) (& row))))
    } pub async fn iter(self,) -> Result < impl futures::Stream < Item = Result
    < T, tokio_postgres :: Error >> + 'a, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let it =
        self.client.query_raw(stmt, cornucopia_async :: private ::
        slice_iter(& self.params)) .await ?
        .map(move | res |
        res.map(| row | (self.mapper) ((self.extractor) (& row)))) .into_stream() ;
        Ok(it)
    }
}#[derive(serde::Serialize, Debug, Clone, PartialEq, )] pub struct RemoveSongById
{ pub cover_object_key : String,pub audio_object_key : String,}pub struct RemoveSongByIdBorrowed < 'a >
{ pub cover_object_key : &'a str,pub audio_object_key : &'a str,} impl < 'a > From < RemoveSongByIdBorrowed <
'a >> for RemoveSongById
{
    fn
    from(RemoveSongByIdBorrowed { cover_object_key,audio_object_key,} : RemoveSongByIdBorrowed < 'a >)
    -> Self { Self { cover_object_key: cover_object_key.into(),audio_object_key: audio_object_key.into(),} }
}pub struct RemoveSongByIdQuery < 'a, C : GenericClient, T, const N : usize >
{
    client : & 'a  C, params :
    [& 'a (dyn postgres_types :: ToSql + Sync) ; N], stmt : & 'a mut cornucopia_async
    :: private :: Stmt, extractor : fn(& tokio_postgres :: Row) -> RemoveSongByIdBorrowed,
    mapper : fn(RemoveSongByIdBorrowed) -> T,
} impl < 'a, C, T : 'a, const N : usize > RemoveSongByIdQuery < 'a, C, T, N >
where C : GenericClient
{
    pub fn map < R > (self, mapper : fn(RemoveSongByIdBorrowed) -> R) -> RemoveSongByIdQuery
    < 'a, C, R, N >
    {
        RemoveSongByIdQuery
        {
            client : self.client, params : self.params, stmt : self.stmt,
            extractor : self.extractor, mapper,
        }
    } pub async fn one(self) -> Result < T, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let row =
        self.client.query_one(stmt, & self.params) .await ? ;
        Ok((self.mapper) ((self.extractor) (& row)))
    } pub async fn all(self) -> Result < Vec < T >, tokio_postgres :: Error >
    { self.iter() .await ?.try_collect().await } pub async fn opt(self) -> Result
    < Option < T >, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ;
        Ok(self.client.query_opt(stmt, & self.params) .await
        ?.map(| row | (self.mapper) ((self.extractor) (& row))))
    } pub async fn iter(self,) -> Result < impl futures::Stream < Item = Result
    < T, tokio_postgres :: Error >> + 'a, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let it =
        self.client.query_raw(stmt, cornucopia_async :: private ::
        slice_iter(& self.params)) .await ?
        .map(move | res |
        res.map(| row | (self.mapper) ((self.extractor) (& row)))) .into_stream() ;
        Ok(it)
    }
}pub fn insert_new_song() -> InsertNewSongStmt
{ InsertNewSongStmt(cornucopia_async :: private :: Stmt :: new("INSERT INTO songs(name, price, primary_genre, secondary_genre, sex, tempo, key, duration, lyric, cover_object_key, audio_object_key)
VALUES ( 
    $1,
    $2,
    (SELECT id FROM genres WHERE name = $3),
    (SELECT id FROM genres WHERE name = $4),
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11
)")) } pub
struct InsertNewSongStmt(cornucopia_async :: private :: Stmt) ; impl
InsertNewSongStmt { pub async fn bind < 'a, C : GenericClient, T1 : cornucopia_async::StringSql,T2 : cornucopia_async::StringSql,T3 : cornucopia_async::StringSql,T4 : cornucopia_async::StringSql,T5 : cornucopia_async::StringSql,T6 : cornucopia_async::StringSql,T7 : cornucopia_async::StringSql,>
(& 'a mut self, client : & 'a  C,
name : & 'a T1,price : & 'a rust_decimal::Decimal,primary_genre : & 'a T2,secondary_genre : & 'a Option<T3>,sex : & 'a T4,tempo : & 'a i16,key : & 'a super::super::types::public::Musickey,duration : & 'a i16,lyric : & 'a T5,cover_obj_key : & 'a T6,audio_obj_key : & 'a T7,) -> Result < u64, tokio_postgres :: Error >
{
    let stmt = self.0.prepare(client) .await ? ;
    client.execute(stmt, & [name,price,primary_genre,secondary_genre,sex,tempo,key,duration,lyric,cover_obj_key,audio_obj_key,]) .await
} }impl < 'a, C : GenericClient + Send + Sync, T1 : cornucopia_async::StringSql,T2 : cornucopia_async::StringSql,T3 : cornucopia_async::StringSql,T4 : cornucopia_async::StringSql,T5 : cornucopia_async::StringSql,T6 : cornucopia_async::StringSql,T7 : cornucopia_async::StringSql,>
cornucopia_async :: Params < 'a, InsertNewSongParams < T1,T2,T3,T4,T5,T6,T7,>, std::pin::Pin<Box<dyn futures::Future<Output = Result <
u64, tokio_postgres :: Error > > + Send + 'a>>, C > for InsertNewSongStmt
{
    fn
    params(& 'a mut self, client : & 'a  C, params : & 'a
    InsertNewSongParams < T1,T2,T3,T4,T5,T6,T7,>) -> std::pin::Pin<Box<dyn futures::Future<Output = Result < u64, tokio_postgres ::
    Error > > + Send + 'a>> { Box::pin(self.bind(client, & params.name,& params.price,& params.primary_genre,& params.secondary_genre,& params.sex,& params.tempo,& params.key,& params.duration,& params.lyric,& params.cover_obj_key,& params.audio_obj_key,) ) }
}pub fn get_song_object_keys_by_id() -> GetSongObjectKeysByIdStmt
{ GetSongObjectKeysByIdStmt(cornucopia_async :: private :: Stmt :: new("SELECT cover_object_key, audio_object_key FROM songs
WHERE songs.id = $1")) } pub
struct GetSongObjectKeysByIdStmt(cornucopia_async :: private :: Stmt) ; impl
GetSongObjectKeysByIdStmt { pub fn bind < 'a, C : GenericClient, >
(& 'a mut self, client : & 'a  C,
id : & 'a i32,) -> GetSongObjectKeysByIdQuery < 'a, C,
GetSongObjectKeysById, 1 >
{
    GetSongObjectKeysByIdQuery
    {
        client, params : [id,], stmt : & mut self.0, extractor :
        | row | { GetSongObjectKeysByIdBorrowed { cover_object_key : row.get(0),audio_object_key : row.get(1),} }, mapper : | it | { <GetSongObjectKeysById>::from(it) },
    }
} }pub fn update_song() -> UpdateSongStmt
{ UpdateSongStmt(cornucopia_async :: private :: Stmt :: new("UPDATE songs
    SET name = $1,
        price = $2,
        primary_genre = (SELECT id FROM genres WHERE name = $3),
        secondary_genre = (SELECT id FROM genres WHERE name = $4),
        sex = $5,
        tempo = $6,
        key = $7,
        duration = $8,
        lyric = $9,
        cover_object_key = $10,
        audio_object_key = $11
WHERE songs.id = $12")) } pub
struct UpdateSongStmt(cornucopia_async :: private :: Stmt) ; impl
UpdateSongStmt { pub async fn bind < 'a, C : GenericClient, T1 : cornucopia_async::StringSql,T2 : cornucopia_async::StringSql,T3 : cornucopia_async::StringSql,T4 : cornucopia_async::StringSql,T5 : cornucopia_async::StringSql,T6 : cornucopia_async::StringSql,T7 : cornucopia_async::StringSql,>
(& 'a mut self, client : & 'a  C,
name : & 'a T1,price : & 'a rust_decimal::Decimal,primary_genre : & 'a T2,secondary_genre : & 'a Option<T3>,sex : & 'a T4,tempo : & 'a i16,key : & 'a super::super::types::public::Musickey,duration : & 'a i16,lyric : & 'a T5,cover_object_key : & 'a T6,audio_object_key : & 'a T7,id : & 'a i32,) -> Result < u64, tokio_postgres :: Error >
{
    let stmt = self.0.prepare(client) .await ? ;
    client.execute(stmt, & [name,price,primary_genre,secondary_genre,sex,tempo,key,duration,lyric,cover_object_key,audio_object_key,id,]) .await
} }impl < 'a, C : GenericClient + Send + Sync, T1 : cornucopia_async::StringSql,T2 : cornucopia_async::StringSql,T3 : cornucopia_async::StringSql,T4 : cornucopia_async::StringSql,T5 : cornucopia_async::StringSql,T6 : cornucopia_async::StringSql,T7 : cornucopia_async::StringSql,>
cornucopia_async :: Params < 'a, UpdateSongParams < T1,T2,T3,T4,T5,T6,T7,>, std::pin::Pin<Box<dyn futures::Future<Output = Result <
u64, tokio_postgres :: Error > > + Send + 'a>>, C > for UpdateSongStmt
{
    fn
    params(& 'a mut self, client : & 'a  C, params : & 'a
    UpdateSongParams < T1,T2,T3,T4,T5,T6,T7,>) -> std::pin::Pin<Box<dyn futures::Future<Output = Result < u64, tokio_postgres ::
    Error > > + Send + 'a>> { Box::pin(self.bind(client, & params.name,& params.price,& params.primary_genre,& params.secondary_genre,& params.sex,& params.tempo,& params.key,& params.duration,& params.lyric,& params.cover_object_key,& params.audio_object_key,& params.id,) ) }
}pub fn remove_song_by_id() -> RemoveSongByIdStmt
{ RemoveSongByIdStmt(cornucopia_async :: private :: Stmt :: new("DELETE FROM songs
WHERE id = $1 RETURNING songs.cover_object_key, songs.audio_object_key")) } pub
struct RemoveSongByIdStmt(cornucopia_async :: private :: Stmt) ; impl
RemoveSongByIdStmt { pub fn bind < 'a, C : GenericClient, >
(& 'a mut self, client : & 'a  C,
id : & 'a i32,) -> RemoveSongByIdQuery < 'a, C,
RemoveSongById, 1 >
{
    RemoveSongByIdQuery
    {
        client, params : [id,], stmt : & mut self.0, extractor :
        | row | { RemoveSongByIdBorrowed { cover_object_key : row.get(0),audio_object_key : row.get(1),} }, mapper : | it | { <RemoveSongById>::from(it) },
    }
} }pub fn insert_genre() -> InsertGenreStmt
{ InsertGenreStmt(cornucopia_async :: private :: Stmt :: new("INSERT INTO genres(name)
VALUES ($1)")) } pub
struct InsertGenreStmt(cornucopia_async :: private :: Stmt) ; impl
InsertGenreStmt { pub async fn bind < 'a, C : GenericClient, T1 : cornucopia_async::StringSql,>
(& 'a mut self, client : & 'a  C,
name : & 'a T1,) -> Result < u64, tokio_postgres :: Error >
{
    let stmt = self.0.prepare(client) .await ? ;
    client.execute(stmt, & [name,]) .await
} }pub fn remove_genre() -> RemoveGenreStmt
{ RemoveGenreStmt(cornucopia_async :: private :: Stmt :: new("DELETE FROM genres WHERE name = $1")) } pub
struct RemoveGenreStmt(cornucopia_async :: private :: Stmt) ; impl
RemoveGenreStmt { pub async fn bind < 'a, C : GenericClient, T1 : cornucopia_async::StringSql,>
(& 'a mut self, client : & 'a  C,
name : & 'a T1,) -> Result < u64, tokio_postgres :: Error >
{
    let stmt = self.0.prepare(client) .await ? ;
    client.execute(stmt, & [name,]) .await
} }pub fn insert_mood() -> InsertMoodStmt
{ InsertMoodStmt(cornucopia_async :: private :: Stmt :: new("INSERT INTO moods(name)
VALUES ($1)")) } pub
struct InsertMoodStmt(cornucopia_async :: private :: Stmt) ; impl
InsertMoodStmt { pub async fn bind < 'a, C : GenericClient, T1 : cornucopia_async::StringSql,>
(& 'a mut self, client : & 'a  C,
name : & 'a T1,) -> Result < u64, tokio_postgres :: Error >
{
    let stmt = self.0.prepare(client) .await ? ;
    client.execute(stmt, & [name,]) .await
} }pub fn remove_mood() -> RemoveMoodStmt
{ RemoveMoodStmt(cornucopia_async :: private :: Stmt :: new("DELETE FROM moods WHERE name = $1")) } pub
struct RemoveMoodStmt(cornucopia_async :: private :: Stmt) ; impl
RemoveMoodStmt { pub async fn bind < 'a, C : GenericClient, T1 : cornucopia_async::StringSql,>
(& 'a mut self, client : & 'a  C,
name : & 'a T1,) -> Result < u64, tokio_postgres :: Error >
{
    let stmt = self.0.prepare(client) .await ? ;
    client.execute(stmt, & [name,]) .await
} }}pub mod open_access
{ use futures::{{StreamExt, TryStreamExt}};use futures; use cornucopia_async::GenericClient;#[derive(serde::Serialize, Debug, Clone, PartialEq, )] pub struct FetchSongs
{ pub song_id : i32,pub song_rating : Option<i32>,pub song_name : String,pub primary_genre : String,pub secondary_genre : String,pub cover_url : String,pub sex : String,pub tempo : i16,pub key : super::super::types::public::Musickey,pub duration : i16,pub lyric : String,}pub struct FetchSongsBorrowed < 'a >
{ pub song_id : i32,pub song_rating : Option<i32>,pub song_name : &'a str,pub primary_genre : &'a str,pub secondary_genre : &'a str,pub cover_url : &'a str,pub sex : &'a str,pub tempo : i16,pub key : super::super::types::public::Musickey,pub duration : i16,pub lyric : &'a str,} impl < 'a > From < FetchSongsBorrowed <
'a >> for FetchSongs
{
    fn
    from(FetchSongsBorrowed { song_id,song_rating,song_name,primary_genre,secondary_genre,cover_url,sex,tempo,key,duration,lyric,} : FetchSongsBorrowed < 'a >)
    -> Self { Self { song_id,song_rating,song_name: song_name.into(),primary_genre: primary_genre.into(),secondary_genre: secondary_genre.into(),cover_url: cover_url.into(),sex: sex.into(),tempo,key,duration,lyric: lyric.into(),} }
}pub struct FetchSongsQuery < 'a, C : GenericClient, T, const N : usize >
{
    client : & 'a  C, params :
    [& 'a (dyn postgres_types :: ToSql + Sync) ; N], stmt : & 'a mut cornucopia_async
    :: private :: Stmt, extractor : fn(& tokio_postgres :: Row) -> FetchSongsBorrowed,
    mapper : fn(FetchSongsBorrowed) -> T,
} impl < 'a, C, T : 'a, const N : usize > FetchSongsQuery < 'a, C, T, N >
where C : GenericClient
{
    pub fn map < R > (self, mapper : fn(FetchSongsBorrowed) -> R) -> FetchSongsQuery
    < 'a, C, R, N >
    {
        FetchSongsQuery
        {
            client : self.client, params : self.params, stmt : self.stmt,
            extractor : self.extractor, mapper,
        }
    } pub async fn one(self) -> Result < T, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let row =
        self.client.query_one(stmt, & self.params) .await ? ;
        Ok((self.mapper) ((self.extractor) (& row)))
    } pub async fn all(self) -> Result < Vec < T >, tokio_postgres :: Error >
    { self.iter() .await ?.try_collect().await } pub async fn opt(self) -> Result
    < Option < T >, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ;
        Ok(self.client.query_opt(stmt, & self.params) .await
        ?.map(| row | (self.mapper) ((self.extractor) (& row))))
    } pub async fn iter(self,) -> Result < impl futures::Stream < Item = Result
    < T, tokio_postgres :: Error >> + 'a, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let it =
        self.client.query_raw(stmt, cornucopia_async :: private ::
        slice_iter(& self.params)) .await ?
        .map(move | res |
        res.map(| row | (self.mapper) ((self.extractor) (& row)))) .into_stream() ;
        Ok(it)
    }
}pub struct StringQuery < 'a, C : GenericClient, T, const N : usize >
{
    client : & 'a  C, params :
    [& 'a (dyn postgres_types :: ToSql + Sync) ; N], stmt : & 'a mut cornucopia_async
    :: private :: Stmt, extractor : fn(& tokio_postgres :: Row) -> & str,
    mapper : fn(& str) -> T,
} impl < 'a, C, T : 'a, const N : usize > StringQuery < 'a, C, T, N >
where C : GenericClient
{
    pub fn map < R > (self, mapper : fn(& str) -> R) -> StringQuery
    < 'a, C, R, N >
    {
        StringQuery
        {
            client : self.client, params : self.params, stmt : self.stmt,
            extractor : self.extractor, mapper,
        }
    } pub async fn one(self) -> Result < T, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let row =
        self.client.query_one(stmt, & self.params) .await ? ;
        Ok((self.mapper) ((self.extractor) (& row)))
    } pub async fn all(self) -> Result < Vec < T >, tokio_postgres :: Error >
    { self.iter() .await ?.try_collect().await } pub async fn opt(self) -> Result
    < Option < T >, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ;
        Ok(self.client.query_opt(stmt, & self.params) .await
        ?.map(| row | (self.mapper) ((self.extractor) (& row))))
    } pub async fn iter(self,) -> Result < impl futures::Stream < Item = Result
    < T, tokio_postgres :: Error >> + 'a, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let it =
        self.client.query_raw(stmt, cornucopia_async :: private ::
        slice_iter(& self.params)) .await ?
        .map(move | res |
        res.map(| row | (self.mapper) ((self.extractor) (& row)))) .into_stream() ;
        Ok(it)
    }
}pub fn fetch_songs() -> FetchSongsStmt
{ FetchSongsStmt(cornucopia_async :: private :: Stmt :: new("SELECT
    songs.id AS song_id,
    songs.rating AS song_rating,
    songs.name AS song_name,
    p.name AS primary_genre,
    s.name AS secondary_genre,
    songs.cover_object_key AS cover_url,
    sex,
    tempo,
    key,
    duration,
    lyric
FROM songs
LEFT JOIN genres p ON songs.primary_genre = p.id
LEFT JOIN genres s ON songs.secondary_genre = s.id")) } pub
struct FetchSongsStmt(cornucopia_async :: private :: Stmt) ; impl
FetchSongsStmt { pub fn bind < 'a, C : GenericClient, >
(& 'a mut self, client : & 'a  C,
) -> FetchSongsQuery < 'a, C,
FetchSongs, 0 >
{
    FetchSongsQuery
    {
        client, params : [], stmt : & mut self.0, extractor :
        | row | { FetchSongsBorrowed { song_id : row.get(0),song_rating : row.get(1),song_name : row.get(2),primary_genre : row.get(3),secondary_genre : row.get(4),cover_url : row.get(5),sex : row.get(6),tempo : row.get(7),key : row.get(8),duration : row.get(9),lyric : row.get(10),} }, mapper : | it | { <FetchSongs>::from(it) },
    }
} }pub fn list_genres() -> ListGenresStmt
{ ListGenresStmt(cornucopia_async :: private :: Stmt :: new("SELECT name FROM genres ORDER BY name")) } pub
struct ListGenresStmt(cornucopia_async :: private :: Stmt) ; impl
ListGenresStmt { pub fn bind < 'a, C : GenericClient, >
(& 'a mut self, client : & 'a  C,
) -> StringQuery < 'a, C,
String, 0 >
{
    StringQuery
    {
        client, params : [], stmt : & mut self.0, extractor :
        | row | { row.get(0) }, mapper : | it | { it.into() },
    }
} }pub fn list_moods() -> ListMoodsStmt
{ ListMoodsStmt(cornucopia_async :: private :: Stmt :: new("SELECT name FROM moods ORDER BY name")) } pub
struct ListMoodsStmt(cornucopia_async :: private :: Stmt) ; impl
ListMoodsStmt { pub fn bind < 'a, C : GenericClient, >
(& 'a mut self, client : & 'a  C,
) -> StringQuery < 'a, C,
String, 0 >
{
    StringQuery
    {
        client, params : [], stmt : & mut self.0, extractor :
        | row | { row.get(0) }, mapper : | it | { it.into() },
    }
} }pub fn get_song_audio_obj_key_by_id() -> GetSongAudioObjKeyByIdStmt
{ GetSongAudioObjKeyByIdStmt(cornucopia_async :: private :: Stmt :: new("SELECT audio_object_key FROM songs
WHERE songs.id = $1")) } pub
struct GetSongAudioObjKeyByIdStmt(cornucopia_async :: private :: Stmt) ; impl
GetSongAudioObjKeyByIdStmt { pub fn bind < 'a, C : GenericClient, >
(& 'a mut self, client : & 'a  C,
id : & 'a i32,) -> StringQuery < 'a, C,
String, 1 >
{
    StringQuery
    {
        client, params : [id,], stmt : & mut self.0, extractor :
        | row | { row.get(0) }, mapper : | it | { it.into() },
    }
} }}pub mod user_auth_queries
{ use futures::{{StreamExt, TryStreamExt}};use futures; use cornucopia_async::GenericClient;#[derive(serde::Serialize, Debug, Clone, PartialEq, )] pub struct GetAuthUserDataByUsername
{ pub id : i32,pub username : String,pub password_hash : String,}pub struct GetAuthUserDataByUsernameBorrowed < 'a >
{ pub id : i32,pub username : &'a str,pub password_hash : &'a str,} impl < 'a > From < GetAuthUserDataByUsernameBorrowed <
'a >> for GetAuthUserDataByUsername
{
    fn
    from(GetAuthUserDataByUsernameBorrowed { id,username,password_hash,} : GetAuthUserDataByUsernameBorrowed < 'a >)
    -> Self { Self { id,username: username.into(),password_hash: password_hash.into(),} }
}pub struct GetAuthUserDataByUsernameQuery < 'a, C : GenericClient, T, const N : usize >
{
    client : & 'a  C, params :
    [& 'a (dyn postgres_types :: ToSql + Sync) ; N], stmt : & 'a mut cornucopia_async
    :: private :: Stmt, extractor : fn(& tokio_postgres :: Row) -> GetAuthUserDataByUsernameBorrowed,
    mapper : fn(GetAuthUserDataByUsernameBorrowed) -> T,
} impl < 'a, C, T : 'a, const N : usize > GetAuthUserDataByUsernameQuery < 'a, C, T, N >
where C : GenericClient
{
    pub fn map < R > (self, mapper : fn(GetAuthUserDataByUsernameBorrowed) -> R) -> GetAuthUserDataByUsernameQuery
    < 'a, C, R, N >
    {
        GetAuthUserDataByUsernameQuery
        {
            client : self.client, params : self.params, stmt : self.stmt,
            extractor : self.extractor, mapper,
        }
    } pub async fn one(self) -> Result < T, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let row =
        self.client.query_one(stmt, & self.params) .await ? ;
        Ok((self.mapper) ((self.extractor) (& row)))
    } pub async fn all(self) -> Result < Vec < T >, tokio_postgres :: Error >
    { self.iter() .await ?.try_collect().await } pub async fn opt(self) -> Result
    < Option < T >, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ;
        Ok(self.client.query_opt(stmt, & self.params) .await
        ?.map(| row | (self.mapper) ((self.extractor) (& row))))
    } pub async fn iter(self,) -> Result < impl futures::Stream < Item = Result
    < T, tokio_postgres :: Error >> + 'a, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let it =
        self.client.query_raw(stmt, cornucopia_async :: private ::
        slice_iter(& self.params)) .await ?
        .map(move | res |
        res.map(| row | (self.mapper) ((self.extractor) (& row)))) .into_stream() ;
        Ok(it)
    }
}#[derive(serde::Serialize, Debug, Clone, PartialEq, )] pub struct GetAuthUserDataById
{ pub id : i32,pub username : String,pub password_hash : String,}pub struct GetAuthUserDataByIdBorrowed < 'a >
{ pub id : i32,pub username : &'a str,pub password_hash : &'a str,} impl < 'a > From < GetAuthUserDataByIdBorrowed <
'a >> for GetAuthUserDataById
{
    fn
    from(GetAuthUserDataByIdBorrowed { id,username,password_hash,} : GetAuthUserDataByIdBorrowed < 'a >)
    -> Self { Self { id,username: username.into(),password_hash: password_hash.into(),} }
}pub struct GetAuthUserDataByIdQuery < 'a, C : GenericClient, T, const N : usize >
{
    client : & 'a  C, params :
    [& 'a (dyn postgres_types :: ToSql + Sync) ; N], stmt : & 'a mut cornucopia_async
    :: private :: Stmt, extractor : fn(& tokio_postgres :: Row) -> GetAuthUserDataByIdBorrowed,
    mapper : fn(GetAuthUserDataByIdBorrowed) -> T,
} impl < 'a, C, T : 'a, const N : usize > GetAuthUserDataByIdQuery < 'a, C, T, N >
where C : GenericClient
{
    pub fn map < R > (self, mapper : fn(GetAuthUserDataByIdBorrowed) -> R) -> GetAuthUserDataByIdQuery
    < 'a, C, R, N >
    {
        GetAuthUserDataByIdQuery
        {
            client : self.client, params : self.params, stmt : self.stmt,
            extractor : self.extractor, mapper,
        }
    } pub async fn one(self) -> Result < T, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let row =
        self.client.query_one(stmt, & self.params) .await ? ;
        Ok((self.mapper) ((self.extractor) (& row)))
    } pub async fn all(self) -> Result < Vec < T >, tokio_postgres :: Error >
    { self.iter() .await ?.try_collect().await } pub async fn opt(self) -> Result
    < Option < T >, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ;
        Ok(self.client.query_opt(stmt, & self.params) .await
        ?.map(| row | (self.mapper) ((self.extractor) (& row))))
    } pub async fn iter(self,) -> Result < impl futures::Stream < Item = Result
    < T, tokio_postgres :: Error >> + 'a, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let it =
        self.client.query_raw(stmt, cornucopia_async :: private ::
        slice_iter(& self.params)) .await ?
        .map(move | res |
        res.map(| row | (self.mapper) ((self.extractor) (& row)))) .into_stream() ;
        Ok(it)
    }
}pub struct StringQuery < 'a, C : GenericClient, T, const N : usize >
{
    client : & 'a  C, params :
    [& 'a (dyn postgres_types :: ToSql + Sync) ; N], stmt : & 'a mut cornucopia_async
    :: private :: Stmt, extractor : fn(& tokio_postgres :: Row) -> & str,
    mapper : fn(& str) -> T,
} impl < 'a, C, T : 'a, const N : usize > StringQuery < 'a, C, T, N >
where C : GenericClient
{
    pub fn map < R > (self, mapper : fn(& str) -> R) -> StringQuery
    < 'a, C, R, N >
    {
        StringQuery
        {
            client : self.client, params : self.params, stmt : self.stmt,
            extractor : self.extractor, mapper,
        }
    } pub async fn one(self) -> Result < T, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let row =
        self.client.query_one(stmt, & self.params) .await ? ;
        Ok((self.mapper) ((self.extractor) (& row)))
    } pub async fn all(self) -> Result < Vec < T >, tokio_postgres :: Error >
    { self.iter() .await ?.try_collect().await } pub async fn opt(self) -> Result
    < Option < T >, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ;
        Ok(self.client.query_opt(stmt, & self.params) .await
        ?.map(| row | (self.mapper) ((self.extractor) (& row))))
    } pub async fn iter(self,) -> Result < impl futures::Stream < Item = Result
    < T, tokio_postgres :: Error >> + 'a, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let it =
        self.client.query_raw(stmt, cornucopia_async :: private ::
        slice_iter(& self.params)) .await ?
        .map(move | res |
        res.map(| row | (self.mapper) ((self.extractor) (& row)))) .into_stream() ;
        Ok(it)
    }
}pub fn get_auth_user_data_by_username() -> GetAuthUserDataByUsernameStmt
{ GetAuthUserDataByUsernameStmt(cornucopia_async :: private :: Stmt :: new("SELECT id, username, password_hash
FROM users
WHERE username = $1")) } pub
struct GetAuthUserDataByUsernameStmt(cornucopia_async :: private :: Stmt) ; impl
GetAuthUserDataByUsernameStmt { pub fn bind < 'a, C : GenericClient, T1 : cornucopia_async::StringSql,>
(& 'a mut self, client : & 'a  C,
username : & 'a T1,) -> GetAuthUserDataByUsernameQuery < 'a, C,
GetAuthUserDataByUsername, 1 >
{
    GetAuthUserDataByUsernameQuery
    {
        client, params : [username,], stmt : & mut self.0, extractor :
        | row | { GetAuthUserDataByUsernameBorrowed { id : row.get(0),username : row.get(1),password_hash : row.get(2),} }, mapper : | it | { <GetAuthUserDataByUsername>::from(it) },
    }
} }pub fn get_auth_user_data_by_id() -> GetAuthUserDataByIdStmt
{ GetAuthUserDataByIdStmt(cornucopia_async :: private :: Stmt :: new("SELECT id, username, password_hash
FROM users
WHERE id = $1")) } pub
struct GetAuthUserDataByIdStmt(cornucopia_async :: private :: Stmt) ; impl
GetAuthUserDataByIdStmt { pub fn bind < 'a, C : GenericClient, >
(& 'a mut self, client : & 'a  C,
id : & 'a i32,) -> GetAuthUserDataByIdQuery < 'a, C,
GetAuthUserDataById, 1 >
{
    GetAuthUserDataByIdQuery
    {
        client, params : [id,], stmt : & mut self.0, extractor :
        | row | { GetAuthUserDataByIdBorrowed { id : row.get(0),username : row.get(1),password_hash : row.get(2),} }, mapper : | it | { <GetAuthUserDataById>::from(it) },
    }
} }pub fn get_user_permissions() -> GetUserPermissionsStmt
{ GetUserPermissionsStmt(cornucopia_async :: private :: Stmt :: new("SELECT DISTINCT permissions.name
FROM users
JOIN users_groups
ON users.id = users_groups.users_id
JOIN groups_permissions
ON users_groups.groups_id = groups_permissions.groups_id
JOIN permissions
ON groups_permissions.permissions_id = permissions.id
WHERE users.id = $1")) } pub
struct GetUserPermissionsStmt(cornucopia_async :: private :: Stmt) ; impl
GetUserPermissionsStmt { pub fn bind < 'a, C : GenericClient, >
(& 'a mut self, client : & 'a  C,
user_id : & 'a i32,) -> StringQuery < 'a, C,
String, 1 >
{
    StringQuery
    {
        client, params : [user_id,], stmt : & mut self.0, extractor :
        | row | { row.get(0) }, mapper : | it | { it.into() },
    }
} }}}