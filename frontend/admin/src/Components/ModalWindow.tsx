import { useDispatch } from "react-redux";
import styles from "./ModalWindow.module.scss";
import { FC } from "react";
import { set_audio_url, set_img_url } from "../state/files_url_slice";

interface ModalWindowProps {
  close_window: () => void;
  reset_all: () => void;
}

const ModalWindow: FC<ModalWindowProps> = ({ close_window, reset_all }) => {
  const dispatch = useDispatch();

  function select_new_files() {
    dispatch(set_audio_url(""));
    dispatch(set_img_url(""));
    reset_all;
  }

  return (
    <div className={styles.modal_window}>
      <div className={styles.content}>
        <p className={styles.message}>
          Вы уверены, что хотите выбрать другие файлы? Старые файлы будут
          удалены
        </p>
        <div className={styles.buttons}>
          <div
            className={`${styles.button} ${styles.delete_button}`}
            onClick={select_new_files}
          >
            Выбрать новые
          </div>
          <div
            className={`${styles.button} ${styles.cancel_button}`}
            onClick={close_window}
          >
            Отменить
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalWindow;
