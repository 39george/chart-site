import styles from "./CurrentSong.module.scss";
import { Component, Index, createSignal } from "solid-js";
import { FiChevronDown } from "solid-icons/fi";
import { ISong } from "../types";
import PauseIcon from "../UI/PauseIcon";

interface CurrentSongProps {
  song: ISong;
}

const CurrentSong: Component<CurrentSongProps> = (props) => {
  const [expanded, set_expanded] = createSignal(false);
  const lyric_format = (lyric: string): string[] => {
    return lyric.split("\n");
  };

  return (
    <div class={styles.current_song_section}>
      <div>
        <div class={styles.image_section}>
          <div class={styles.image_wrapper}>
            <img
              src={props.song.cover_url}
              alt="cover"
              draggable={false}
            />
            <PauseIcon
              size="big"
              position={{ right: "0.75rem", bottom: "0.75rem" }}
            />
          </div>
          <div class={styles.background_decor}></div>
        </div>
        <p class={styles.name}>{props.song.name}</p>
      </div>
      <div class={styles.meta_info}>
        <div class={styles.general}>
          <p class={styles.info_header}>Общая информация</p>
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
          <p class={styles.info_header}>Текст песни</p>
          <div class={`${styles.text} ${expanded() && styles.text_expanded}`}>
            <Index each={lyric_format(props.song.lyric)}>
              {(s) => {
                if (s() === "") {
                  return <br />;
                }
                return <p>{s()}</p>;
              }}
            </Index>
          </div>
          <div
            class={`${styles.expand_button} ${
              expanded() && styles.button_expanded
            }`}
            onclick={() => set_expanded(!expanded())}
          >
            {!expanded() ? <p>показать</p> : <p>свернуть</p>}
            <FiChevronDown class={styles.chevron} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentSong;
