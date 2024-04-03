import styles from "./UploadFormComponent.module.scss";
import { FC } from "react";
import { NavLink, Outlet } from "react-router-dom";

const UploadFormComponent: FC = () => {
  return (
    <div className={styles.upload_form_container}>
      <div className={styles.steps}>
        <p className={styles.step_name}>Файлы</p>
        <p className={styles.step_count}>&nbsp;- Шаг 1 из 4</p>
      </div>
      <div className={styles.upload_form_content}>
        <div className={styles.upload_form_nav}>
          <NavLink
            to="step_1"
            className={({ isActive }) =>
              isActive
                ? `${styles.step_link} ${styles.link_active}`
                : `${styles.step_link}`
            }
          >
            Файлы
          </NavLink>
          <NavLink
            to="step_2"
            className={({ isActive }) =>
              isActive
                ? `${styles.step_link} ${styles.link_active}`
                : `${styles.step_link}`
            }
          >
            Общая информация
          </NavLink>
          <NavLink
            to="step_3"
            className={({ isActive }) =>
              isActive
                ? `${styles.step_link} ${styles.link_active}`
                : `${styles.step_link}`
            }
          >
            Метадата
          </NavLink>
          <NavLink
            to="step_4"
            className={({ isActive }) =>
              isActive
                ? `${styles.step_link} ${styles.link_active}`
                : `${styles.step_link}`
            }
          >
            Предпросмотр
          </NavLink>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default UploadFormComponent;
