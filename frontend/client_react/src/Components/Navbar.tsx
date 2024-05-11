import styles from "./Navbar.module.scss";
import logo_light from "../assets/logo_light.png";
import logo_dark from "../assets/logo_dark.png";
import { HiSun, HiMoon } from "react-icons/hi";
import { FC, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { RootState } from "../state/store";
import { useDispatch, useSelector } from "react-redux";
import { ColorThemes } from "../types";
import { set_theme } from "../state/color_theme_slice";
import useAxios from "../Hooks/APIRequests";
import { API_URL } from "../config";

type ActivePageName = "home" | "contacts" | "";

const Navbar: FC = () => {
  const location = useLocation();
  const [active_page, set_active_page] = useState<ActivePageName>(
    location.pathname === "/"
      ? "home"
      : location.pathname === "contacts"
      ? "contacts"
      : ""
  );
  const color_theme = useSelector<RootState, ColorThemes>(
    (state) => state.color_theme.theme
  );
  const { fetch_data: post_theme } = useAxios();
  const dispatch = useDispatch();

  function handle_page_click(pageName: ActivePageName) {
    set_active_page(pageName);
  }

  function handle_change_theme() {
    color_theme === "White"
      ? dispatch(set_theme("Dark"))
      : dispatch(set_theme("White"));

    try_to_post_theme();
  }

  async function try_to_post_theme() {
    const data = JSON.stringify(color_theme === "White" ? "Dark" : "White");
    await post_theme({
      method: "PUT",
      url: `${API_URL}/session/theme`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    });
  }

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.image_wrapper}>
          <img
            src={color_theme === "White" ? logo_light : logo_dark}
            alt="logo"
            draggable={false}
            className={styles.logo}
          />
        </div>
        <Link
          to="/"
          className={`${styles.link} ${
            active_page === "home" && styles.active_link
          }`}
          onClick={() => handle_page_click("home")}
        >
          Каталог
        </Link>
        <Link
          to="contacts"
          className={`${styles.link} ${
            active_page === "contacts" && styles.active_link
          }`}
          onClick={() => handle_page_click("contacts")}
        >
          Контакты
        </Link>
        <div
          className={styles.theme_switch_container}
          onClick={handle_change_theme}
        >
          {color_theme === "White" ? (
            <HiSun className={styles.theme_icon} />
          ) : (
            <HiMoon className={styles.theme_icon} />
          )}
          <p className={styles.hover_text}>
            {color_theme === "White" ? "темная тема" : "светлая тема"}
          </p>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
