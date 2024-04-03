import styles from "./MainPage.module.scss";
import { FC } from "react";
import { TiPlus } from "react-icons/ti";
import SongsList from "../Components/SongsList";
import { Link } from "react-router-dom";

const MainPage: FC = () => {
  return (
    <section className={styles.main_page}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.h1}>Загруженные песни</h1>
          <Link
            to="upload_new_song"
            className={styles.add_song_button}
          >
            <p>загрузить новую песню</p>
            <TiPlus className={styles.plus_icon} />
          </Link>
        </div>
        <SongsList />
      </div>
    </section>
  );
};

export default MainPage;
