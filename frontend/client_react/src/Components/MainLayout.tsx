import styles from "./MainLayout.module.scss";
import { FC } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { ColorThemes } from "../types";
import { RootState } from "../state/store";
import { useSelector } from "react-redux";

const MainLayout: FC = () => {
  const color_theme = useSelector<RootState, ColorThemes>(
    (state) => state.color_theme.theme
  );

  return (
    <>
      <Navbar />
      <Outlet />
      <div className={styles.decor_container}>
        <div
          className={styles.bg_decor}
          style={{ filter: `invert(${color_theme === "light" ? 0 : 1})` }}
        ></div>
      </div>
    </>
  );
};

export default MainLayout;
