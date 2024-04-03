import styles from "./Navbar.module.scss";
import logo from "../assets/logo.png";
import { FC } from "react";

const Navbar: FC = () => {
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
      </nav>
    </>
  );
};

export default Navbar;
