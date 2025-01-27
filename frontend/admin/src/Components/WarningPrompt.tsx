import styles from "./WarningPropmt.module.scss";
import { FC } from "react";
import { FaXmark } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { reset_song_data } from "../state/song_data_slice";
import { reset_chosen_files } from "../state/chosen_files_slice";
import { reset_urls } from "../state/files_url_slice";
import { useNavigate } from "react-router-dom";
import { IoReturnUpBack } from "react-icons/io5";

interface WarningPromptProps {
  close_prompt: () => void;
}

const WarningPropmt: FC<WarningPromptProps> = ({ close_prompt }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handle_proceed() {
    dispatch(reset_song_data());
    dispatch(reset_chosen_files());
    dispatch(reset_urls());
    navigate("/");
  }

  return (
    <div className={styles.prompt_bg}>
      <div className={styles.content}>
        <p className={styles.header}>Вернуться назад</p>
        <p className={styles.info}>
          Вы точно хотите вернуться? Все изменения будут утеряны
        </p>
        <div className={styles.action_buttons}>
          <div
            className={`${styles.action_button} ${styles.proceed_button}`}
            onClick={handle_proceed}
          >
            <p>Вернуться</p>
            <IoReturnUpBack className={styles.action_icon} />
          </div>
          <div
            className={`${styles.action_button} ${styles.cancel_button}`}
            onClick={close_prompt}
          >
            <p>Отмена</p>
            <FaXmark className={styles.action_icon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningPropmt;
