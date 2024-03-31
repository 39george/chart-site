import styles from "./SongItem.module.scss";
import { ISong } from "../types";
import { Component } from "solid-js";
import { BsPlayCircle } from "solid-icons/bs";

interface SongItemProps {
  song: ISong;
  order_number: number;
}

const SongItem: Component<SongItemProps> = (props) => {
  return (
    <div class={styles.song_item}>
      <p class={styles.order_number}>{props.order_number}</p>
      <div class={styles.image_wrapper}>
        <img
          src={props.song.cover_url}
          alt="cover"
          draggable={false}
        />
        <BsPlayCircle class={styles.play_pause_icon} />
      </div>
      <p class={styles.name}>{props.song.name}</p>
      <div class={styles.meta_and_price}>
        <div class={styles.meta_info}>
          <div class={styles.meta_unit}>{props.song.sex}</div>
          <div class={styles.meta_unit}>{props.song.primary_genre}</div>
          <div class={styles.meta_unit}>{props.song.moods[0]}</div>
        </div>
        <p class={styles.price}>{props.song.price}</p>
      </div>
    </div>
  );
};

export default SongItem;
