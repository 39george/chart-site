import styles from "./SongsList.module.scss";
import { Component, For, Show, createEffect, createSignal } from "solid-js";
import { FaSolidBars } from "solid-icons/fa";
import { BsGridFill } from "solid-icons/bs";
import { songs } from "../data";
import SongItem from "./SongItem";
import CurrentSong from "./CurrentSong";
import { ISong } from "../types";
import {
  checked_gender,
  checked_genres_moods,
  price_value,
} from "../store/global_store";
import { MAX_PRICE, MIN_PRICE } from "./Filters";

function is_in_bounds(min: number, max: number, song_price: number): boolean {
  return song_price >= min && song_price <= max;
}

const SongsList: Component = () => {
  const [current_song_idx, set_current_song_idx] = createSignal<number>(-1);
  const [filtered_songs, set_filtered_songs] = createSignal<ISong[]>([
    ...songs,
  ]);

  createEffect(() => {
    set_filtered_songs(
      songs
        .filter((song) => {
          let gender = checked_gender().checked;
          if (gender === "Любой") {
            return true;
          } else {
            return song.sex === gender;
          }
        })
        .filter((song) => {
          let genres = checked_genres_moods().genres;
          if (genres.length === 0) {
            return true;
          }
          return genres.includes(song.primary_genre);
        })
        .filter((song) => {
          let moods = checked_genres_moods().moods;
          if (moods.length === 0) {
            return true;
          }
          return moods.includes(song.moods[0]);
        })
        .filter((song) => {
          let min = Number.parseInt(price_value().from.replace(/\s/g, ""));
          min = Number.isNaN(min) ? MIN_PRICE : min;
          let max = Number.parseInt(price_value().to.replace(/\s/g, ""));
          max = Number.isNaN(max) ? MAX_PRICE : max;
          return is_in_bounds(min, max, Number.parseFloat(song.price));
        })
    );
  });

  const toggle_current_song = (idx: number) => {
    set_current_song_idx(idx);
  };
  return (
    <div class={styles.songs_section}>
      <Show
        when={filtered_songs().length !== 0}
        fallback={<div>no songs matched the filters</div>}
      >
        <div
          class={`${styles.songs_list} ${
            current_song_idx() !== -1 && styles.song_list_short
          }`}
        >
          <div class={styles.view_switch}>
            <div class={`${styles.switch_option} ${styles.active_option}`}>
              <FaSolidBars class={styles.switch_icon} />
            </div>
            <div class={styles.switch_option}>
              <BsGridFill class={styles.switch_icon} />
            </div>
          </div>
          <For each={filtered_songs()}>
            {(song, i) => {
              return (
                <SongItem
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
                  order_number={i() + 1}
                  toggle_current_song={toggle_current_song}
                  current_song_idx={current_song_idx()}
                />
              );
            }}
          </For>
        </div>
      </Show>
      <Show when={current_song_idx() !== -1}>
        <CurrentSong song={filtered_songs()[current_song_idx()]} />
      </Show>
    </div>
  );
};

export default SongsList;
