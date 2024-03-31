import Filters from "../Components/Filters";
import styles from "./MainPage.module.scss";
import { Component } from "solid-js";

const MainPage: Component = () => {
  return (
    <section class={styles.main_page}>
      <div class={styles.content}>
        <h1 class={styles.h1}>Каталог песен</h1>
        <Filters />
      </div>
    </section>
  );
};

export default MainPage;
