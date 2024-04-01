import styles from "./SongItem.module.scss";
import { ISong } from "../types";
import { Component } from "solid-js";
import { BsPlayCircle } from "solid-icons/bs";
import PauseIcon from "../UI/PauseIcon";
import { format_price } from "../helpers";

interface SongItemProps {
  song: ISong;
  order_number: number;
  toggle_current_song: (idx: number) => void;
  current_song_idx: number;
}

const SongItem: Component<SongItemProps> = (props) => {
  return (
    <div
      class={`${styles.song_item} ${
        props.current_song_idx === props.order_number - 1 && styles.current_song
      }`}
      onclick={() => props.toggle_current_song(props.order_number - 1)}
    >
      <p class={styles.order_number}>{props.order_number}</p>
      <div class={styles.image_wrapper}>
        <img
          src={props.song.cover_url}
          alt="cover"
          draggable={false}
        />
        {props.current_song_idx === props.order_number - 1 && (
          <PauseIcon
            size="small"
            position={{ top: "50%", left: "50%" }}
          />
        )}
        <BsPlayCircle class={styles.play_icon} />
      </div>
      <p class={styles.name}>{props.song.name}</p>
      <div class={styles.meta_and_price}>
        <div class={styles.meta_info}>
          <div class={styles.meta_unit}>{props.song.sex}</div>
          <div class={styles.meta_unit}>{props.song.primary_genre}</div>
          <div class={styles.meta_unit}>{props.song.moods[0]}</div>
        </div>
        <p class={styles.price}>{format_price(props.song.price)}₽</p>
      </div>
    </div>
  );
};

export default SongItem;
