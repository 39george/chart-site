import { Link } from "react-router-dom";
import styles from "./InfoModalWindow.module.scss";
import { FC } from "react";
import { SubmitStatus } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { set_song_submit_status } from "../state/song_submit_data_slice";
import { reset_song_data } from "../state/song_data_slice";
import { reset_urls } from "../state/files_url_slice";
import { reset_chosen_files } from "../state/chosen_files_slice";

interface InfoModalWindowPorps {
  error_data?: string;
}

const InfoModalWindow: FC<InfoModalWindowPorps> = ({ error_data }) => {
  const state = useSelector<RootState, SubmitStatus>(
    (state) => state.song_submit_data.submit_status
  );
  const dispatch = useDispatch();

  function handle_click() {
    dispatch(set_song_submit_status(""));
    dispatch(reset_song_data());
    dispatch(reset_urls());
    dispatch(reset_chosen_files());
  }

  return (
    <div className={styles.info_modal}>
      {state === "pending" ? (
        <div className={styles.loader_big}></div>
      ) : (
        <div className={styles.content}>
          <p className={styles.header}>
            {state === "success" && "Песня успешно загружена!"}
            {state === "error" && "Ошибка"}
          </p>
          <p className={styles.info}>
            {state === "success" && "Вы можете вернуться на главную страницу"}
            {state === "error" && error_data}
          </p>
          <Link
            to="/"
            className={styles.return_button}
            onClick={handle_click}
          >
            На главную
          </Link>
        </div>
      )}
    </div>
  );
};

export default InfoModalWindow;
