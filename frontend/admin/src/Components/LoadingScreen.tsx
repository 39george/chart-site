import styles from "./LoadingScreen.module.scss";
import { FC } from "react";

const LoadingScreen: FC = () => {
  return (
    <div className={styles.loader_bg}>
      <div className={styles.loader_big}></div>
    </div>
  );
};

export default LoadingScreen;
