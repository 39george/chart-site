--! insert_new_song (secondary_genre?)
INSERT INTO songs(name, price, primary_genre, secondary_genre, sex, tempo, key, duration, lyric, cover_object_key, audio_object_key)
VALUES ( 
    :name,
    :price,
    (SELECT id FROM genres WHERE name = :primary_genre),
    (SELECT id FROM genres WHERE name = :secondary_genre),
    :sex,
    :tempo,
    :key,
    :duration,
    :lyric,
    :cover_obj_key,
    :audio_obj_key
);

--! remove_song_by_id
DELETE FROM songs
WHERE id = :id RETURNING songs.cover_object_key, songs.audio_object_key;
