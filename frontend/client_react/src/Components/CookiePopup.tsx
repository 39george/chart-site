import { FC, useState } from "react";
import styles from "./CookiePopup.module.scss";
import { useDispatch } from "react-redux";
import { setCookieRejected } from "../state/cookieRejectedSlice";

const CookiePopup: FC = () => {
  const [visible, setVisible] = useState(true);
  const dispatch = useDispatch();

  function handleRejectClick() {
    dispatch(setCookieRejected(true));
  }

  return (
    <div
      className={styles.cookie_popup}
      style={{ display: `${visible ? "flex" : "none"}` }}
    >
      <p className={styles.description}>
        Этот сайт использует файлы cookie <br />
        <a
          href="https://yandex.ru/support2/browser/ru/personal-data-protection/cookies#what"
          target="_blank"
        >
          (подробнее о cookie)
        </a>
      </p>
      <div className={styles.action_buttons}>
        <button
          className={`${styles.button} ${styles.button_agree}`}
          onClick={() => setVisible(false)}
        >
          Согласиться
        </button>
        <button
          className={`${styles.button} ${styles.button_disagree}`}
          onClick={handleRejectClick}
        >
          Отказаться
        </button>
      </div>
    </div>
  );
};

export default CookiePopup;
