import styles from "./UploadFormComponent.module.scss";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { IStep, ISteps, StepName } from "../types";

interface UploadFormComponentProps {
  state: {
    steps: ISteps;
    current_step: StepName;
    change_step: (step: IStep) => void;
  };
}

const UploadFormComponent: FC<UploadFormComponentProps> = ({ state }) => {
  return (
    <div className={styles.upload_form_container}>
      <div className={styles.steps}>
        <p className={styles.step_name}>Файлы</p>
        <p className={styles.step_count}>
          &nbsp;- Шаг {state.current_step.substring(5)} из 4
        </p>
      </div>
      <div className={styles.upload_form_content}>
        <div className={styles.upload_form_nav}>
          <p
            className={`${styles.step_link} ${
              state.steps.step_1.active
                ? styles.link_active
                : styles.link_inactive
            } ${state.current_step === "step_1" && styles.link_current}`}
            onClick={() => state.change_step(state.steps.step_1)}
          >
            Файлы
          </p>
          <p
            className={`${styles.step_link} ${
              state.steps.step_2.active
                ? styles.link_active
                : styles.link_inactive
            } ${state.current_step === "step_2" && styles.link_current}`}
            onClick={() => state.change_step(state.steps.step_2)}
          >
            Общая информация
          </p>
          <p
            className={`${styles.step_link} ${
              state.steps.step_3.active
                ? styles.link_active
                : styles.link_inactive
            } ${state.current_step === "step_3" && styles.link_current}`}
            onClick={() => state.change_step(state.steps.step_3)}
          >
            Метадата
          </p>
          <p
            className={`${styles.step_link} ${
              state.steps.step_4.active
                ? styles.link_active
                : styles.link_inactive
            } ${state.current_step === "step_4" && styles.link_current}`}
            onClick={() => state.change_step(state.steps.step_4)}
          >
            Предпросмотр
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default UploadFormComponent;
