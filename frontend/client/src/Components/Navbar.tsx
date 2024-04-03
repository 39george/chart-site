import styles from "./Navbar.module.scss";
import { ParentComponent, createSignal } from "solid-js";
import logo from "../assets/logo.png";
import { useLocation } from "@solidjs/router";

type ActivePageName = "home" | "contacts" | "";

const Navbar: ParentComponent = (props) => {
  const location = useLocation();
  const [active_page, set_active_page] = createSignal<ActivePageName>(
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
      <nav class={styles.navbar}>
        <div class={styles.image_wrapper}>
          <img
            src={logo}
            alt="logo"
            draggable={false}
            class={styles.logo}
          />
        </div>
        <a
          href="/"
          class={`${styles.link} ${
            active_page() === "home" && styles.active_link
          }`}
          onClick={() => handle_page_click("home")}
        >
          Каталог
        </a>
        <a
          href="/contacts"
          class={`${styles.link} ${
            active_page() === "contacts" && styles.active_link
          }`}
          onClick={() => handle_page_click("contacts")}
        >
          Контакты
        </a>
      </nav>
      {props.children}
    </>
  );
};

export default Navbar;
