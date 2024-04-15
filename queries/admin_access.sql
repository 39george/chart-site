--! insert_new_song_get_id (secondary_genre?, rating?)
INSERT INTO songs(name, price, rating, primary_genre, secondary_genre, sex, tempo, key, duration, lyric, cover_object_key, audio_object_key)
VALUES ( 
    :name,
    :price,
    :rating,
    (SELECT id FROM genres WHERE name = :primary_genre),
    (SELECT id FROM genres WHERE name = :secondary_genre),
    :sex,
    :tempo,
    :key,
    :duration,
    :lyric,
    :cover_obj_key,
    :audio_obj_key
) RETURNING id;

--! get_song_cover_object_key_by_id
SELECT cover_object_key FROM songs
WHERE songs.id = :id;

--! get_song_audio_object_key_by_id
SELECT audio_object_key FROM songs
WHERE songs.id = :id;

--! update_song_metadata (secondary_genre?, rating?)
UPDATE songs
    SET name = :name,
        price = :price,
        rating = :rating,
        primary_genre = (SELECT id FROM genres WHERE name = :primary_genre),
        secondary_genre = (SELECT id FROM genres WHERE name = :secondary_genre),
        sex = :sex,
        tempo = :tempo,
        key = :key,
        duration = :duration,
        lyric = :lyric,
        updated_at = CURRENT_TIMESTAMP
WHERE songs.id = :id;

--! update_song_cover
UPDATE songs
    SET cover_object_key = :cover_object_key
WHERE songs.id = :id;

--! update_song_audio
UPDATE songs
    SET audio_object_key = :audio_object_key,
        updated_at = CURRENT_TIMESTAMP
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

--! add_mood_to_song
INSERT INTO songs_moods (songs_id, moods_id)
VALUES (
    :song_id,
    (SELECT id FROM moods WHERE name = :mood)
);

--! remove_moods_from_song
DELETE FROM songs_moods
WHERE songs_id = :song_id;

--! set_song_rating
UPDATE songs SET rating = :new_rating
WHERE songs.id = :song_id;
