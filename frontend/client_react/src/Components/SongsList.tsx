import styles from "./SongsList.module.scss";
import { FaBars } from "react-icons/fa6";
import { IoGrid } from "react-icons/io5";
import SongItem from "./SongItem";
import CurrentSong from "./CurrentSong";
import { GenderOptions, GenresMoods, ISong, PriceValues } from "../types";
import useAxios from "../Hooks/APIRequests";
import { API_URL } from "../config";
import { extract_genres, extract_moods } from "../helpers";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { set_songs } from "../state/songs_slice";
import { set_genres, set_moods } from "../state/genres_moods_slice";
import { RootState } from "../state/store";
import { set_max_price, set_min_price } from "../state/min_max_price_slice";

const SongsList: FC = () => {
  const [current_song_idx, set_current_song_idx] = useState<number>(-1);
  const [filtered_songs, set_filtered_songs] = useState<ISong[]>([]);
  const { error_data: fetch_songs_error_data, fetch_data: fetch_songs } =
    useAxios();
  const songs = useSelector<RootState, ISong[]>((state) => state.songs.songs);
  const checked_gender = useSelector<RootState, GenderOptions>(
    (state) => state.checked_gender.checked
  );
  const checked_genres_moods = useSelector<RootState, GenresMoods>(
    (state) => state.checked_genres_moods
  );
  const MIN_PRICE = useSelector<RootState, number>(
    (state) => state.min_max_price.min
  );
  const MAX_PRICE = useSelector<RootState, number>(
    (state) => state.min_max_price.max
  );
  const price_value = useSelector<RootState, PriceValues>(
    (state) => state.price_value
  );
  const dispatch = useDispatch();

  function is_in_bounds(min: number, max: number, song_price: number): boolean {
    return song_price >= min && song_price <= max;
  }

  function toggle_current_song(idx: number) {
    set_current_song_idx(idx);
  }

  async function try_to_fetch_songs() {
    const response = await fetch_songs({
      method: "GET",
      url: `${API_URL}/open/songs`,
    });
    if (response?.status === 200) {
      dispatch(set_songs([...response.data]));
    }
  }

  useEffect(() => {
    try_to_fetch_songs();
  }, []);

  useEffect(() => {
    dispatch(set_genres(extract_genres(songs)));
    dispatch(set_moods(extract_moods(songs)));
    dispatch(
      set_max_price(
        Math.max.apply(
          Math,
          songs.map((song) => Number.parseFloat(song.price))
        )
      )
    );
    dispatch(
      set_min_price(
        Math.min.apply(
          Math,
          songs.map((song) => Number.parseFloat(song.price))
        )
      )
    );

    set_filtered_songs(
      songs
        .filter((song) => {
          let gender = checked_gender;
          if (gender === "Любой") {
            return true;
          } else {
            return song.sex === gender;
          }
        })
        .filter((song) => {
          let genres = checked_genres_moods.genres;
          if (genres.length === 0) {
            return true;
          }
          return genres.includes(song.primary_genre);
        })
        .filter((song) => {
          let moods = checked_genres_moods.moods;
          if (moods.length === 0) {
            return true;
          }
          return moods.includes(song.moods[0]);
        })
        .filter((song) => {
          let min = Number.parseInt(price_value.from.replace(/\s/g, ""));
          min = Number.isNaN(min) ? MIN_PRICE : min;
          let max = Number.parseInt(price_value.to.replace(/\s/g, ""));
          max = Number.isNaN(max) ? MAX_PRICE : max;
          return is_in_bounds(min, max, Number.parseFloat(song.price));
        })
    );
  }, [songs]);

  return (
    <div className={styles.songs_section}>
      {filtered_songs.length === 0 ? (
        <div>Нет песен с такими параметрами</div>
      ) : (
        <div
          className={`${styles.songs_list} ${
            current_song_idx !== -1 && styles.songs_list_short
          }`}
        >
          <div className={styles.view_switch}>
            <div className={`${styles.switch_option} ${styles.active_option}`}>
              <FaBars className={styles.switch_icon} />
            </div>
            <div className={styles.switch_option}>
              <IoGrid className={styles.switch_icon} />
            </div>
          </div>
          {filtered_songs.map((song, idx) => {
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
                order_number={idx + 1}
                toggle_current_song={toggle_current_song}
                current_song_idx={current_song_idx}
              />
            );
          })}
        </div>
      )}
      {current_song_idx !== -1 && (
        <CurrentSong song={filtered_songs[current_song_idx]} />
      )}
    </div>
  );
};

export default SongsList;
