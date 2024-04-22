import styles from "./DeleteSongPrompt.module.scss";
import { FC, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { FaXmark } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { API_URL } from "../config";
import { set_song_list_updated } from "../state/song_list_updated_slice";
import useAxios from "../Hooks/APIRequests";

interface DeleteSongPromptProps {
  song_name: string;
  song_id: number;
  close_window: () => void;
}

const DeleteSongPrompt: FC<DeleteSongPromptProps> = ({
  song_id,
  song_name,
  close_window,
}) => {
  const [loader_visible, set_loader_visible] = useState(false);
  const { fetch_data: delete_song } = useAxios();
  const dispatch = useDispatch();

  async function try_to_delete(id: number) {
    set_loader_visible(true);
    const response = await delete_song({
      method: "DELETE",
      url: `${API_URL}/protected/song/${id}`,
    });
    if (response?.status === 200) {
      dispatch(set_song_list_updated(true));
      set_loader_visible(false);
    } else {
      set_loader_visible(false);
    }
  }

  return (
    <div className={styles.prompt_bg}>
      <div className={styles.content}>
        <p className={styles.header}>Удаление песни</p>
        {loader_visible ? (
          <div className={styles.loader_small}></div>
        ) : (
          <p className={styles.info}>
            Вы точно хотите удалить песню "{song_name}"? Это действие нельзя
            отменить
          </p>
        )}
        <div className={styles.action_buttons}>
          <div
            className={`${styles.action_button} ${styles.delete_button}`}
            onClick={() => try_to_delete(song_id)}
          >
            <p>Удалить песню</p>
            <FiTrash2 className={styles.action_icon} />
          </div>
          <div
            className={`${styles.action_button} ${styles.cancel_button}`}
            onClick={close_window}
          >
            <p>Отмена</p>
            <FaXmark className={styles.action_icon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteSongPrompt;
