import styles from "./UploadFormComponent.module.scss";
import { FC } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { CurrentStep } from "../types";

interface UploadFormComponentProps {
  state: {
    current_step: CurrentStep;
    change_step: (step: CurrentStep) => void;
  };
}

const UploadFormComponent: FC<UploadFormComponentProps> = ({ state }) => {
  return (
    <div className={styles.upload_form_container}>
      <div className={styles.steps}>
        <p className={styles.step_name}>Файлы</p>
        <p className={styles.step_count}>
          &nbsp;- Шаг {state.current_step} из 4
        </p>
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
            onClick={() => state.change_step(CurrentStep.Step_1)}
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
            onClick={() => state.change_step(CurrentStep.Step_2)}
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
            onClick={() => state.change_step(CurrentStep.Step_3)}
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
            onClick={() => state.change_step(CurrentStep.Step_4)}
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
