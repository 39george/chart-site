import styles from "./SongsList.module.scss";
import { FaBars } from "react-icons/fa6";
import { IoGrid } from "react-icons/io5";
import SongItem from "./SongItem";
import CurrentSong from "./CurrentSong";
import { GenderOptions, GenresMoods, ISong, PriceValues } from "../types";
import { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { set_current_song_id } from "../state/current_song_data_slice";
import { set_are_songs_fetching } from "../state/songs_slice";

const SongsList: FC = () => {
  const [filtered_songs, set_filtered_songs] = useState<ISong[]>([]);
  const current_ref = useRef<HTMLDivElement>(null);

  const songs = useSelector<RootState, ISong[]>((state) => state.songs.songs);
  const are_songs_fetching = useSelector<RootState, boolean>(
    (state) => state.songs.are_fetching
  );
  const current_song_id = useSelector<RootState, number>(
    (state) => state.current_song_data.id
  );
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

  function toggle_current_song(id: number) {
    dispatch(set_current_song_id(id));
  }

  useEffect(() => {
    if (current_ref.current) {
      current_ref.current.scrollIntoView({
        behavior: "instant",
        block: "start",
      });

      window.scrollBy({
        top: -200,
      });
    }
  }, [current_ref.current]);

  useEffect(() => {
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
  }, [songs, checked_gender, checked_genres_moods, price_value]);

  useEffect(() => {
    let timeout: number;

    if (songs.length !== 0) {
      timeout = setTimeout(() => {
        dispatch(set_are_songs_fetching(false));
      }, 400);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [songs]);

  return (
    <div className={styles.songs_section}>
      {are_songs_fetching ? (
        <div className={styles.loader_small}></div>
      ) : songs.length === 0 ? (
        <div>Список песен пока пуст... Скоро мы что-нибудь выложим!</div>
      ) : filtered_songs.length === 0 ? (
        <div>Нет песен с такими параметрами</div>
      ) : (
        <div className={`${styles.songs_list}`}>
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
              <div key={idx}>
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
                />
                {song.id === current_song_id && (
                  <div ref={current_ref}>
                    <CurrentSong
                      song={filtered_songs.find(
                        (song) => song.id === current_song_id
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SongsList;
