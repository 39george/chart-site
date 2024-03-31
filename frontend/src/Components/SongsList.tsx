import styles from "./SongsList.module.scss";
import { Component, For } from "solid-js";
import { FaSolidBars } from "solid-icons/fa";
import { BsGridFill } from "solid-icons/bs";
import { songs } from "../data";
import SongItem from "./SongItem";
import CurrentSong from "./CurrentSong";

const SongsList: Component = () => {
  return (
    <div class={styles.songs_section}>
      <div class={styles.songs_list}>
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
              />
            );
          }}
        </For>
      </div>
      <CurrentSong song={songs[0]} />
    </div>
  );
};

export default SongsList;
