import styles from "./SongItem.module.scss";
import { ISong } from "../types";
import { BsPlayCircle, BsPauseCircle } from "react-icons/bs";
import { format_price } from "../helpers";
import { FC, useEffect, useRef, useState } from "react";
import useAxios from "../Hooks/APIRequests";
import { API_URL } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { set_song_url } from "../state/song_url_slice";
import { RootState } from "../state/store";
import { set_current_song_playing } from "../state/current_song_data_slice";

interface SongItemProps {
  song: ISong;
  order_number: number;
  toggle_current_song: (id: number) => void;
  price_popup_visible_id: number;
  toggle_price_popup_visible: (id: number) => void;
  currentVisibleId: number | null;
  showCurrent: (id: number) => void;
}

const SongItem: FC<SongItemProps> = (props) => {
  const [is_small_screen, set_is_small_screen] = useState(
    window.innerWidth <= 378
  );
  const popup_ref = useRef<HTMLDivElement>(null);
  const songRef = useRef<HTMLDivElement>(null);
  const [popup_width, set_popup_width] = useState<number | undefined>(0);
  const { fetch_data: fetch_song_url } = useAxios();
  const current_song_id = useSelector<RootState, number>(
    (state) => state.current_song_data.id
  );
  const current_song_playing = useSelector<RootState, boolean>(
    (state) => state.current_song_data.is_palying
  );
  const dispatch = useDispatch();

  async function handle_song_click(id: number) {
    if (current_song_id !== props.song.id) {
      await get_url(id);
      dispatch(set_current_song_playing(true));
      props.toggle_current_song(id);
    } else {
      if (props.currentVisibleId) {
        dispatch(set_current_song_playing(!current_song_playing));
      }
    }
    props.showCurrent(props.song.id);
  }

  function handle_price_click(e: React.MouseEvent) {
    if (window.innerWidth > 378) {
      return;
    }
    e.stopPropagation();
    props.toggle_price_popup_visible(props.song.id);
  }

  async function get_url(id: number) {
    const response = await fetch_song_url({
      method: "GET",
      url: `${API_URL}/open/audio_url/${id}`,
    });
    if (response?.status === 200) {
      dispatch(set_song_url(response.data));
    }
  }

  useEffect(() => {
    set_popup_width(popup_ref.current?.clientWidth);
  }, [popup_ref, props.price_popup_visible_id]);

  useEffect(() => {
    const handle_resize = () => {
      set_is_small_screen(window.innerWidth <= 378);
    };

    window.addEventListener("resize", handle_resize);

    return () => {
      window.removeEventListener("resize", handle_resize);
    };
  }, []);

  function handlePlayPauseClick(e: React.MouseEvent) {
    e.stopPropagation();
    dispatch(set_current_song_playing(!current_song_playing));
  }
  return (
    <div
      className={`${styles.song_item} ${
        current_song_id === props.song.id && styles.current_song
      }`}
      onClick={() => handle_song_click(props.song.id)}
      ref={songRef}
    >
      <p className={styles.order_number}>{props.order_number}</p>
      <div className={styles.image_wrapper}>
        <img
          src={props.song.cover_url}
          alt="cover"
          draggable={false}
        />
        {current_song_id === props.song.id && (
          <div onClick={handlePlayPauseClick}>
            {!current_song_playing ? (
              <BsPlayCircle className={styles.playpause_icon} />
            ) : (
              <BsPauseCircle className={styles.playpause_icon} />
            )}
          </div>
        )}
      </div>
      <div className={styles.name_and_meta}>
        <p className={styles.name}>{props.song.name}</p>
        <div className={styles.meta_info}>
          <div className={styles.meta_unit}>
            <span className={styles.hash_tag}>#</span>
            {props.song.sex === "female" ? "Женский" : "Мужской"}
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
          ref={popup_ref}
          className={`${styles.price_pop_up} ${
            props.price_popup_visible_id === props.song.id &&
            is_small_screen &&
            styles.price_pop_up_visible
          }`}
          style={{
            left: `calc((${Math.floor(
              popup_width ? popup_width : 0
            )}px + .75rem) * -1)`,
          }}
        >
          {format_price(props.song.price)}
        </div>
      </div>
    </div>
  );
};

export default SongItem;
