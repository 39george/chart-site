import styles from "./Navbar.module.scss";
import logo from "../assets/logo.png";
import { FC, useState } from "react";
import { Link, useLocation } from "react-router-dom";

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

  function handle_page_click(pageName: ActivePageName) {
    set_active_page(pageName);
  }

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.image_wrapper}>
          <img
            src={logo}
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
      </nav>
    </>
  );
};

export default Navbar;
