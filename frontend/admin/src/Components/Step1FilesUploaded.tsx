import styles from "./Step1FilesUploaded.module.scss";
import ModalWindow from "./SongsUploadedModal";
import { FC, useState } from "react";

interface Step1FilesUploadedProps {
  reset_all: () => void;
}

const Step1FilesUploaded: FC<Step1FilesUploadedProps> = ({ reset_all }) => {
  const [modal_visible, set_modal_visible] = useState(false);

  function close_modal() {
    set_modal_visible(false);
  }

  return (
    <div className={styles.conditional_window}>
      <div className={styles.header}>
        Файлы успешно загружены! Вы можете переходить к следующему шагу
      </div>
      <div
        className={styles.reset_files_button}
        onClick={() => set_modal_visible(true)}
      >
        Выбрать другие файлы
      </div>
      {modal_visible && (
        <ModalWindow
          close_window={close_modal}
          reset_all={reset_all}
        />
      )}
    </div>
  );
};

export default Step1FilesUploaded;
