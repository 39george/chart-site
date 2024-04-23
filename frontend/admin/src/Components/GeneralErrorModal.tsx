import styles from "./GeneralErrorModal.module.scss";
import { FC } from "react";
import { FaXmark } from "react-icons/fa6";

interface GeneralErrorModalProps {
  err_message: string;
  close_modal: () => void;
}

const GeneralErrorModal: FC<GeneralErrorModalProps> = ({
  err_message,
  close_modal,
}) => {
  return (
    <div className={styles.err_modal}>
      <div className={styles.content}>
        <div
          className={styles.close_icon_container}
          onClick={close_modal}
        >
          <FaXmark className={styles.close_icon} />
        </div>
        <p className={styles.header}>Ошибка</p>
        <p className={styles.info}>{err_message}</p>
      </div>
    </div>
  );
};

export default GeneralErrorModal;
