--! fetch_songs : (secondary_genre?, rating?)
SELECT
    sng.id,
    sng.created_at,
    sng.updated_at,
    sng.rating,
    sng.price,
    sng.name,
    pg.name AS primary_genre,
    sg.name AS secondary_genre,
    sng.cover_object_key AS cover_url,
    sex,
    tempo,
    key,
    duration,
    lyric,
    COALESCE(ARRAY_AGG(DISTINCT m.name) FILTER (WHERE m.name IS NOT NULL), ARRAY[]::text[]) AS moods
FROM songs sng
LEFT JOIN genres pg ON sng.primary_genre = pg.id
LEFT JOIN genres sg ON sng.secondary_genre = sg.id
LEFT JOIN songs_moods sm ON sng.id = sm.songs_id
LEFT JOIN moods m ON sm.moods_id = m.id
GROUP BY
    sng.id,
    sng.rating,
    sng.price,
    sng.name,
    pg.name,
    sg.name
;

--! list_genres
SELECT name FROM genres ORDER BY name;

--! list_moods
SELECT name FROM moods ORDER BY name;

--! get_song_audio_obj_key_by_id
SELECT audio_object_key FROM songs
WHERE songs.id = :id; 

