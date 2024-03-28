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

--! get_song_object_keys_by_id
SELECT cover_object_key, audio_object_key FROM songs
WHERE songs.id = :id;

--! update_song (secondary_genre?)
UPDATE songs
    SET name = :name,
        price = :price,
        primary_genre = (SELECT id FROM genres WHERE name = :primary_genre),
        secondary_genre = (SELECT id FROM genres WHERE name = :secondary_genre),
        sex = :sex,
        tempo = :tempo,
        key = :key,
        duration = :duration,
        lyric = :lyric,
        cover_object_key = :cover_object_key,
        audio_object_key = :audio_object_key
WHERE songs.id = :id;

--! remove_song_by_id
DELETE FROM songs
WHERE id = :id RETURNING songs.cover_object_key, songs.audio_object_key;

--! insert_genre
INSERT INTO genres(name)
VALUES (:name);

--! remove_genre
DELETE FROM genres WHERE name = :name;

--! insert_mood
INSERT INTO moods(name)
VALUES (:name);

--! remove_mood
DELETE FROM moods WHERE name = :name;
