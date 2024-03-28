--! fetch_songs : (secondary_genre?, song_rating?)
SELECT
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
LEFT JOIN genres s ON songs.secondary_genre = s.id;

--! list_genres
SELECT name FROM genres ORDER BY name;

--! list_moods
SELECT name FROM moods ORDER BY name;

--! get_song_audio_obj_key_by_id
SELECT audio_object_key FROM songs
WHERE songs.id = :id; 

