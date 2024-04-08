import styles from "./SongItem.module.scss";
import { ISong } from "../types";
import { TbDots } from "react-icons/tb";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { format_price } from "../helpers";
import { FC, useState } from "react";
import useAxios from "../Hooks/APIRequests";
import { API_URL } from "../config";
import { useDispatch } from "react-redux";
import { set_song_list_updated } from "../state/song_list_updated_slice";

interface SongItemProps {
  song: ISong;
  idx: number;
}

const SongItem: FC<SongItemProps> = (props) => {
  const [price_popup_visible, set_price_popup_visible] = useState(false);
  const [options_popup_visible, set_options_popup_visible] = useState(false);
  const { error_data: delete_error_data, fetch_data: delete_song } = useAxios();
  const dispatch = useDispatch();

  function handle_price_click(e: React.MouseEvent<HTMLDivElement>) {
    if (window.innerWidth > 378) {
      return;
    }
    e.stopPropagation();
    set_price_popup_visible(!price_popup_visible);
  }

  async function try_to_delete(id: number) {
    const response = await delete_song({
      method: "DELETE",
      url: `${API_URL}/protected/song/${id}`,
    });
    if (response?.status === 200) {
      dispatch(set_song_list_updated(true));
    }
  }

  return (
    <div className={`${styles.song_item}`}>
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
        className={styles.options}
        onClick={() => set_options_popup_visible(!options_popup_visible)}
      >
        <TbDots className={styles.dots_icon} />
        {options_popup_visible && (
          <div
            className={styles.options_popup}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.edit}>
              <FiEdit className={styles.edit_icon} />
              <p>редактировать</p>
            </div>
            <div
              className={styles.delete}
              onClick={() => try_to_delete(props.song.id)}
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
