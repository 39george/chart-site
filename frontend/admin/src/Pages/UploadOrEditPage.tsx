import styles from "./UploadOrEditPage.module.scss";
import { FC, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import UploadFormContainer from "../Components/UploadFormContainer";
import WarningPropmt from "../Components/WarningPrompt";

interface UploadOrEditPageProps {
  kind: "upload" | "edit";
}

const UploadOrEditPage: FC<UploadOrEditPageProps> = ({ kind }) => {
  const [warning_visible, set_warning_visible] = useState(false);

  function close_propmt() {
    set_warning_visible(false);
  }

  return (
    <div className={styles.upload_new_section}>
      {warning_visible && <WarningPropmt close_prompt={close_propmt} />}
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.h1}>
            {kind === "upload" ? "Новая песня" : "Редактирование песни"}
          </h1>
          <div
            className={styles.return}
            onClick={() => set_warning_visible(true)}
          >
            вернуться назад
            <FaXmark className={styles.close_icon} />
          </div>
        </div>
        <UploadFormContainer />
      </div>
    </div>
  );
};

export default UploadOrEditPage;
