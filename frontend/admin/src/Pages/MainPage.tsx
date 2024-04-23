import styles from "./MainPage.module.scss";
import { FC, useState } from "react";
import { TiPlus } from "react-icons/ti";
import { FiEdit } from "react-icons/fi";
import SongsList from "../Components/SongsList";
import { Link } from "react-router-dom";
import EditGenresMoods from "../Components/EditGenresMoods";

interface MainPagePorps {
  genres_list: string[];
  moods_list: string[];
  fetch_genres_error: string;
  fetch_moods_error: string;
  genres_moods_fetching: boolean;
}

const MainPage: FC<MainPagePorps> = ({
  genres_list,
  moods_list,
  fetch_genres_error,
  fetch_moods_error,
  genres_moods_fetching,
}) => {
  const [edit_window_visible, set_edit_window_visible] = useState<
    "genres" | "moods" | ""
  >("");

  function handle_close_edit_window() {
    set_edit_window_visible("");
  }
  return (
    <section className={styles.main_page}>
      <div className={styles.content}>
        {edit_window_visible !== "" && (
          <EditGenresMoods
            kind={edit_window_visible === "genres" ? "genres" : "moods"}
            items_list={
              edit_window_visible === "genres" ? genres_list : moods_list
            }
            close_window={handle_close_edit_window}
            fetch_genres_error={fetch_genres_error}
            fetch_moods_error={fetch_moods_error}
            genres_moods_fetching={genres_moods_fetching}
          />
        )}
        <div className={styles.header}>
          <h1 className={styles.h1}>Загруженные песни</h1>
          <div className={styles.action_buttons}>
            <div
              className={styles.edit_genres_moods_button}
              onClick={() => set_edit_window_visible("genres")}
            >
              <p>редактировать жанры</p>
              <FiEdit className={styles.edit_icon} />
            </div>
            <div
              className={styles.edit_genres_moods_button}
              onClick={() => set_edit_window_visible("moods")}
            >
              <p>редактировать настроения</p>
              <FiEdit className={styles.edit_icon} />
            </div>
            <Link
              to="upload_new_song"
              className={styles.add_song_button}
            >
              <p>загрузить новую песню</p>
              <TiPlus className={styles.plus_icon} />
            </Link>
          </div>
        </div>
        <SongsList />
      </div>
    </section>
  );
};

export default MainPage;
