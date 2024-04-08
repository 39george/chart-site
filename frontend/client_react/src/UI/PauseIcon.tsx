import styles from "./PauseIcon.module.scss";
import { FC } from "react";

interface PauseIconProps {
  size: "big" | "small";
  position: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
}

const PauseIcon: FC<PauseIconProps> = (props) => {
  return (
    <div
      className={`${styles.pause_icon} ${
        props.size === "big" ? styles.big : styles.small
      }`}
      style={{
        top: `${props.position.top}`,
        right: `${props.position.right}`,
        bottom: `${props.position.bottom}`,
        left: `${props.position.left}`,
      }}
    >
      <div
        className={`${styles.pause_stick} ${
          props.size === "big" ? styles.stick_big : styles.stick_small
        }`}
      ></div>
      <div
        className={`${styles.pause_stick} ${
          props.size === "big" ? styles.stick_big : styles.stick_small
        }`}
      ></div>
    </div>
  );
};

export default PauseIcon;
