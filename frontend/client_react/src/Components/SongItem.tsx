import styles from "./SongItem.module.scss";
import { ISong } from "../types";
import { BsPlayCircle } from "react-icons/bs";
import PauseIcon from "../UI/PauseIcon";
import { format_price } from "../helpers";
import { FC, useState } from "react";

interface SongItemProps {
  song: ISong;
  order_number: number;
  toggle_current_song: (idx: number) => void;
  current_song_idx: number;
}

const SongItem: FC<SongItemProps> = (props) => {
  const [popup_visible, set_popup_visible] = useState(false);

  function handle_price_click(e: React.MouseEvent) {
    if (window.innerWidth > 378) {
      return;
    }
    e.stopPropagation();
    set_popup_visible(!popup_visible);
  }

  return (
    <div
      className={`${styles.song_item} ${
        props.current_song_idx === props.order_number - 1 && styles.current_song
      }`}
      onClick={() => props.toggle_current_song(props.order_number - 1)}
    >
      <p className={styles.order_number}>{props.order_number}</p>
      <div className={styles.image_wrapper}>
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
        <BsPlayCircle className={styles.play_icon} />
      </div>
      <div className={styles.name_and_meta}>
        <p className={styles.name}>{props.song.name}</p>
        <div className={styles.meta_info}>
          <div className={styles.meta_unit}>
            <span className={styles.hash_tag}>#</span>
            {props.song.sex}
          </div>
          <div className={styles.meta_unit}>
            <span className={styles.hash_tag}>#</span>
            {props.song.primary_genre}
          </div>
          <div className={styles.meta_unit}>
            <span className={styles.hash_tag}>#</span>
            {props.song.moods[0]}
          </div>
        </div>
      </div>
      <div
        className={styles.price}
        onClick={handle_price_click}
      >
        <span className={styles.price_number}>
          {format_price(props.song.price)}
        </span>
        ₽
        <div
          className={`${styles.price_pop_up} ${
            popup_visible && styles.price_pop_up_visible
          }`}
        >
          {format_price(props.song.price)}
        </div>
      </div>
    </div>
  );
};

export default SongItem;
