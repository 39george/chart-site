CREATE TABLE moods (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO moods (name)
VALUES 
('агрессивный'),
('амбиент'),
('сердитый'),
('подвижный'),
('успокаивающий'),
('беззаботный'),
('веселый'),
('холодный'),
('сложный'),
('крутой'),
('темный'),
('тревожный'),
('драматичный'),
('мечтательный'),
('жуткий'),
('изысканный'),
('энергичный'),
('восторженный'),
('эпический'),
('фанковый'),
('футуристичный'),
('нежный'),
('в восторге'),
('мрачный'),
('грувовый'),
('счастливый'),
('резкий'),
('завораживающий'),
('юмористический'),
('гипнотический'),
('индустриальный'),
('интенсивный'),
('интимный'),
('радостный'),
('расслабленный'),
('легкий'),
('живой'),
('безумный'),
('мягкий'),
('мистический'),
('зловещий'),
('страстный'),
('пасторальный'),
('мирный'),
('игривый'),
('трогательный'),
('тихий'),
('мятежный'),
('задумчивый'),
('романтический'),
('шумный'),
('грустный'),
('сентиментальный'),
('сексуальный'),
('гладкий'),
('космический'),
('духовный'),
('странный'),
('сладкий'),
('театральный'),
('триповый'),
('теплый'),
('капризный');

-- If product is not sold and creator wants to delete it,
-- we can delete it safely.
CREATE TABLE songs_moods (
    songs_id INTEGER REFERENCES songs(id) ON DELETE CASCADE,
    moods_id INTEGER REFERENCES moods(id) ON DELETE RESTRICT,
    CONSTRAINT pk_songs_moods PRIMARY KEY (songs_id, moods_id)
);

-- Check maximum moods count for song
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

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_check_mood_limit
BEFORE INSERT OR DELETE ON songs_moods
FOR EACH ROW EXECUTE FUNCTION check_moods_limit();

