import styles from "./PauseIcon.module.scss";
import { Component } from "solid-js";

interface PauseIconProps {
  size: "big" | "small";
  position: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
}

const PauseIcon: Component<PauseIconProps> = (props) => {
  return (
    <div
      class={`${styles.pause_icon} ${
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
        class={`${styles.pause_stick} ${
          props.size === "big" ? styles.stick_big : styles.stick_small
        }`}
      ></div>
      <div
        class={`${styles.pause_stick} ${
          props.size === "big" ? styles.stick_big : styles.stick_small
        }`}
      ></div>
    </div>
  );
};

export default PauseIcon;
