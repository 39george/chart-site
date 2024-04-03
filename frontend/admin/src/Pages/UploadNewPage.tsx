import styles from "./UploadNewPage.module.scss";
import { FC } from "react";
import { FaXmark } from "react-icons/fa6";
import { Link } from "react-router-dom";
import UploadFormContainer from "../Components/UploadFormContainer";

const UploadNewPage: FC = () => {
  return (
    <div className={styles.upload_new_section}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.h1}>Новая песня</h1>
          <Link
            to="/"
            className={styles.return}
          >
            вернуться назад
            <FaXmark className={styles.close_icon} />
          </Link>
        </div>
        <UploadFormContainer />
      </div>
    </div>
  );
};

export default UploadNewPage;
