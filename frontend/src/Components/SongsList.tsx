import styles from "./SongsList.module.scss";
import { Component, For, Show, createSignal } from "solid-js";
import { FaSolidBars } from "solid-icons/fa";
import { BsGridFill } from "solid-icons/bs";
import { songs } from "../data";
import SongItem from "./SongItem";
import CurrentSong from "./CurrentSong";

const SongsList: Component = () => {
  const [current_song_idx, set_current_song_idx] = createSignal<number>(-1);

  const toggle_current_song = (idx: number) => {
    set_current_song_idx(idx);
  };
  return (
    <div class={styles.songs_section}>
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
        <For each={songs}>
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
      <Show when={current_song_idx() !== -1}>
        <CurrentSong song={songs[current_song_idx()]} />
      </Show>
    </div>
  );
};

export default SongsList;
