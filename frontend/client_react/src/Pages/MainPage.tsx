import styles from "./MainPage.module.scss";
import { FC } from "react";
import Filters from "../Components/Filters";
import SongsList from "../Components/SongsList";

const MainPage: FC = () => {
  return (
    <section className={styles.main_page}>
      <div className={styles.content}>
        <h1 className={styles.h1}>Каталог песен</h1>
        <Filters />
        <SongsList />
      </div>
    </section>
  );
};

export default MainPage;
