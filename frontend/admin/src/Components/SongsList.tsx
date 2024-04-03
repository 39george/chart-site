import styles from "./SongsList.module.scss";
import { FC } from "react";
import { mock_songs } from "../data";
import SongItem from "./SongItem";

const SongsList: FC = () => {
  return (
    <div className={styles.songs_section}>
      <div className={styles.songs_list}>
        {mock_songs.map((song, idx) => {
          return (
            <SongItem
              key={idx}
              song={{
                cover_url: song.cover_url,
                created_at: song.created_at,
                duration: song.duration,
                id: song.id,
                lyric: song.lyric,
                moods: song.moods,
                name: song.name,
                price: song.price,
                primary_genre: song.primary_genre,
                raiting: song.raiting,
                sex: song.sex,
              }}
              idx={idx}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SongsList;
