import styles from "./SongsList.module.scss";
import { FC, useEffect, useState } from "react";
import SongItem from "./SongItem";
import { ISong } from "../types";
import useAxios from "../Hooks/APIRequests";
import { API_URL } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { set_song_list_updated } from "../state/song_list_updated_slice";

const SongsList: FC = () => {
  const [songs_list, set_songs_list] = useState<ISong[]>([]);
  const { error_data: songs_fetch_error, fetch_data: fetch_songs } = useAxios();
  const song_list_updated = useSelector<RootState, boolean>(
    (state) => state.song_list_updated.song_list_updated
  );
  const dispatch = useDispatch();

  async function try_to_fetch_songs() {
    const response = await fetch_songs({
      method: "GET",
      url: `${API_URL}/open/songs`,
    });
    if (response?.status === 200) {
      set_songs_list(response.data);
    }
  }

  useEffect(() => {
    try_to_fetch_songs();
    if (song_list_updated) {
      dispatch(set_song_list_updated(false));
    }
  }, [song_list_updated]);

  return (
    <div className={styles.songs_section}>
      <div className={styles.songs_list}>
        {songs_list.map((song, idx) => {
          return (
            <SongItem
              key={idx}
              song={{
                cover_url: song.cover_url,
                created_at: song.created_at,
                updated_at: song.updated_at,
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
