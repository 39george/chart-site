--! fetch_songs
SELECT 
    songs.name AS song_name,
    p.name AS primary_genre,
    s.name AS secondary_genre,
    sex,
    tempo,
    key,
    duration,
    lyric
FROM songs
LEFT JOIN genres p ON songs.primary_genre = p.id
LEFT JOIN genres s ON songs.secondary_genre = s.id;

--! list_genres
SELECT name from genres ORDER BY name;

