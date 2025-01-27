import styles from "./SongItem.module.scss";
import { ISong } from "../types";
import { TbDots } from "react-icons/tb";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { format_price } from "../helpers";
import { FC, useRef, useState } from "react";
import DeleteSongPrompt from "./DeleteSongPrompt";
import useAxios from "../Hooks/APIRequests";
import { API_URL } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { set_audio_url, set_img_url } from "../state/files_url_slice";
// import { useNavigate } from "react-router-dom";
import { ISongData, set_song_data } from "../state/song_data_slice";
import { RootState } from "../state/store";

interface SongItemProps {
  song: ISong;
  idx: number;
  options_popup_id_visible: number;
  handle_options_click: (id: number) => void;
}

const SongItem: FC<SongItemProps> = (props) => {
  const [price_popup_visible, set_price_popup_visible] = useState(false);
  const [delete_prompt_visible, set_delete_prompt_visible] = useState(false);
  const song_data = useSelector<RootState, ISongData>(
    (state) => state.song_data
  );
  const popup_ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { fetch_data: fetch_song_url, error_data: url_fetch_error } =
    useAxios();

  function handle_price_click(e: React.MouseEvent<HTMLDivElement>) {
    if (window.innerWidth > 378) {
      return;
    }
    e.stopPropagation();
    set_price_popup_visible(!price_popup_visible);
  }

  function handle_close_delete_prompt() {
    set_delete_prompt_visible(false);
  }

  async function handle_edit_click() {
    dispatch(
      set_song_data({
        ...song_data.song,
        audio_object_key: "s",
        cover_object_key: "s",
        lyric: props.song.lyric,
        moods: props.song.moods,
        name: props.song.name,
        price: props.song.price,
        primary_genre: props.song.primary_genre,
        rating: props.song.raiting,
        sex: props.song.sex,
      })
    );
    dispatch(set_img_url(props.song.cover_url));
    await get_url(props.song.id);

    // navigate("/edit_song");
  }

  async function get_url(id: number) {
    const response = await fetch_song_url({
      method: "GET",
      url: `${API_URL}/open/audio_url/${id}`,
    });
    if (response?.status === 200) {
      dispatch(set_audio_url(response.data));
    } else {
      console.error(url_fetch_error);
    }
  }

  return (
    <div className={`${styles.song_item}`}>
      {delete_prompt_visible && (
        <DeleteSongPrompt
          song_id={props.song.id}
          song_name={props.song.name}
          close_window={handle_close_delete_prompt}
        />
      )}
      <p className={styles.order_number}>{props.idx + 1}</p>
      <div className={styles.image_wrapper}>
        <img
          src={props.song.cover_url}
          alt="cover"
          draggable={false}
        />
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
        onClick={(e) => handle_price_click(e)}
      >
        <span className={styles.price_number}>
          {format_price(props.song.price)}
        </span>
        ₽
        <div
          className={`${styles.price_pop_up} ${
            price_popup_visible && styles.price_pop_up_visible
          }`}
        >
          {format_price(props.song.price)}
        </div>
      </div>
      <div
        ref={popup_ref}
        className={styles.options}
        onClick={() => props.handle_options_click(props.song.id)}
      >
        <TbDots className={styles.dots_icon} />
        {props.song.id === props.options_popup_id_visible && (
          <div
            className={styles.options_popup}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={styles.edit}
              onClick={handle_edit_click}
            >
              <FiEdit className={styles.edit_icon} />
              <p>редактировать</p>
            </div>
            <div
              className={styles.delete}
              onClick={() => set_delete_prompt_visible(true)}
            >
              <FiTrash2 className={styles.delete_icon} />
              <p>удалить</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongItem;
