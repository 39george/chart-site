import styles from "./CurrentSong.module.scss";
import { Component } from "solid-js";
import { BsPauseCircle } from "solid-icons/bs";
import { FiChevronDown } from "solid-icons/fi";
import { ISong } from "../types";

interface CurrentSongProps {
  song: ISong;
}

const CurrentSong: Component<CurrentSongProps> = (props) => {
  return (
    <div class={styles.current_song_section}>
      <div class={styles.image_section}>
        <div class={styles.image_wrapper}>
          <img
            src={props.song.cover_url}
            alt="cover"
            draggable={false}
          />
          <BsPauseCircle class={styles.play_pause_icon} />
          <div class={styles.background_decor}></div>
        </div>
        <p class={styles.name}></p>
      </div>
      <div class={styles.meta_info}>
        <div class={styles.genreal}>
          <p class={styles.header}>Общая информация</p>
          <div class={styles.stats}>
            <div class={styles.stat_unit}>
              <p class={styles.stat_type}>Пол</p>
              <p class={styles.stat_value}>{props.song.sex}</p>
            </div>
            <div class={styles.stat_unit}>
              <p class={styles.stat_type}>Жанр</p>
              <p class={styles.stat_value}>{props.song.primary_genre}</p>
            </div>
            <div class={styles.stat_unit}>
              <p class={styles.stat_type}>Настроение</p>
              <p class={styles.stat_value}>{props.song.moods[0]}</p>
            </div>
            <div class={styles.stat_unit}>
              <p class={styles.stat_type}>Цена</p>
              <p class={styles.stat_value}>{props.song.price}</p>
            </div>
          </div>
        </div>
        <div class={styles.text_section}>
          <p class={styles.header}>Текст песни</p>
          <p class={styles.text}>{props.song.lyric}</p>
          <div class={styles.expand_button}>
            <p>развернуть</p>
            <FiChevronDown class={styles.chevron} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentSong;
