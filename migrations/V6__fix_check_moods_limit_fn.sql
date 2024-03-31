CREATE OR REPLACE FUNCTION check_moods_limit()
RETURNS TRIGGER AS $$
DECLARE
    mood_count INTEGER;
BEGIN
    -- Check mood count when inserting a new mood
    IF TG_OP = 'INSERT' THEN
        SELECT COUNT(*) INTO mood_count
        FROM songs_moods
        WHERE songs_id = NEW.songs_id;

        IF mood_count >= 3 THEN
            RAISE EXCEPTION 'A product can have at most 3 moods.';
        END IF;
    END IF;

    -- Return OLD for DELETE operations to allow the deletion to proceed
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
