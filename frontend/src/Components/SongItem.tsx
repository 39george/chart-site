import styles from "./SongItem.module.scss";
import { ISong } from "../types";
import { Component, createSignal } from "solid-js";
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
  const [popup_visible, set_popup_visible] = createSignal(false);

  function handle_price_click(e: MouseEvent) {
    if (window.innerWidth > 378) {
      return;
    }
    e.stopPropagation();
    set_popup_visible(!popup_visible());
  }

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
      <div class={styles.name_and_meta}>
        <p class={styles.name}>{props.song.name}</p>
        <div class={styles.meta_info}>
          <div class={styles.meta_unit}>
            <span class={styles.hash_tag}>#</span>
            {props.song.sex}
          </div>
          <div class={styles.meta_unit}>
            <span class={styles.hash_tag}>#</span>
            {props.song.primary_genre}
          </div>
          <div class={styles.meta_unit}>
            <span class={styles.hash_tag}>#</span>
            {props.song.moods[0]}
          </div>
        </div>
      </div>
      <div
        class={styles.price}
        onClick={(e) => handle_price_click(e)}
      >
        <span class={styles.price_number}>
          {format_price(props.song.price)}
        </span>
        ₽
        <div
          class={`${styles.price_pop_up} ${
            popup_visible() && styles.price_pop_up_visible
          }`}
        >
          {format_price(props.song.price)}
        </div>
      </div>
    </div>
  );
};

export default SongItem;
