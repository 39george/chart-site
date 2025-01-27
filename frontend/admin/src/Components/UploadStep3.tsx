import styles from "./UploadStep3.module.scss";
import { ISongData, set_song_data } from "../state/song_data_slice";
import { FC, useEffect, useRef, useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import { useDispatch } from "react-redux";
import { format_input_price } from "../helpers";

interface UploadStep3Props {
  song_data: ISongData;
  genres_list: string[];
  moods_list: string[];
}

type InputPopup = "gender" | "genres" | "moods" | "";

interface InputRefs {
  gender_ref: React.RefObject<HTMLDivElement>;
  genre_ref: React.RefObject<HTMLDivElement>;
  mood_ref: React.RefObject<HTMLDivElement>;
}

const UploadStep3: FC<UploadStep3Props> = ({
  song_data,
  genres_list,
  moods_list,
}) => {
  const [popup_visible, set_popup_visibe] = useState<InputPopup>("");
  const input_refs: InputRefs = {
    gender_ref: useRef(null),
    genre_ref: useRef(null),
    mood_ref: useRef(null),
  };
  const [focus_ref, set_focus_ref] = useState<HTMLDivElement | null>();
  const dispatch = useDispatch();

  function handle_input_change(e: React.ChangeEvent<HTMLInputElement>) {
    const { name } = e.target;
    let only_digit = e.target.value.replace(/[^\d]/g, "");

    if (name === "moods") {
      dispatch(
        set_song_data({
          ...song_data.song,
          moods: [e.target.id],
        })
      );
      set_popup_visibe("");
      return;
    }

    if (name === "sex" || name === "primary_genre") {
      dispatch(
        set_song_data({
          ...song_data.song,
          [name]: e.target.id,
        })
      );
      set_popup_visibe("");
      return;
    }

    if (name === "price") {
      dispatch(
        set_song_data({
          ...song_data.song,
          price: only_digit,
        })
      );
      return;
    }

    if (name === "rating") {
      if (only_digit) {
        dispatch(
          set_song_data({
            ...song_data.song,
            rating: parseFloat(only_digit),
          })
        );
      } else {
        dispatch(
          set_song_data({
            ...song_data.song,
            rating: null,
          })
        );
      }
    }
  }

  function handle_popup_visible(popup: InputPopup) {
    if (popup === popup_visible) {
      set_popup_visibe("");
    } else {
      set_popup_visibe(popup);
    }

    switch (popup) {
      case "":
        set_focus_ref(null);
        break;
      case "gender":
        if (input_refs.gender_ref.current) {
          set_focus_ref(input_refs.gender_ref.current);
        }
        break;
      case "genres":
        if (input_refs.genre_ref.current) {
          set_focus_ref(input_refs.genre_ref.current);
        }
        break;
      case "moods":
        if (input_refs.mood_ref.current) {
          set_focus_ref(input_refs.mood_ref.current);
        }
        break;
    }
  }

  useEffect(() => {
    const handle_click_outside_filter = (e: MouseEvent) => {
      if (!focus_ref?.contains(e.target as Node)) {
        set_popup_visibe("");
      }
    };

    document.addEventListener("mousedown", handle_click_outside_filter);

    return () => {
      document.removeEventListener("mousedown", handle_click_outside_filter);
    };
  }, [focus_ref]);

  return (
    <div className={styles.upload_step_3}>
      <div
        ref={input_refs.gender_ref}
        className={`${styles.input_container} ${styles.input_gender}`}
      >
        <p className={styles.label}>Пол</p>
        <div
          className={`${styles.input_field} ${styles.field_gender}`}
          onClick={() => handle_popup_visible("gender")}
        >
          {song_data.song.sex === "female" ? "Женский" : "Мужской"}
          <GoTriangleDown
            className={`${styles.triangle_icon} ${
              popup_visible === "gender" && styles.popup_visible
            }`}
          />
        </div>
        {popup_visible === "gender" && (
          <div className={styles.popup}>
            <div className={styles.input_options}>
              <input
                type="radio"
                id="male"
                name="sex"
                onChange={handle_input_change}
                checked={song_data.song.sex === "male"}
              />
              <span className={styles.custom_checkbox}></span>
              <label
                htmlFor="male"
                className={styles.input_option}
              >
                &nbsp;&nbsp;Мужской
              </label>
            </div>
            <div className={styles.input_options}>
              <input
                type="radio"
                id="female"
                name="sex"
                onChange={handle_input_change}
                checked={song_data.song.sex === "female"}
              />
              <span className={styles.custom_checkbox}></span>
              <label
                htmlFor="female"
                className={styles.input_option}
              >
                &nbsp;&nbsp;Женский
              </label>
            </div>
          </div>
        )}
      </div>
      <div
        ref={input_refs.genre_ref}
        className={`${styles.input_container} ${styles.container_genres}`}
      >
        <p className={styles.label}>Жанр</p>
        <div
          className={`${styles.input_field} ${
            !song_data.song.primary_genre && styles.input_default
          }`}
          onClick={() => handle_popup_visible("genres")}
        >
          {song_data.song.primary_genre
            ? song_data.song.primary_genre
            : "Жанр песни"}
          <GoTriangleDown
            className={`${styles.triangle_icon} ${
              popup_visible === "genres" && styles.popup_visible
            }`}
          />
        </div>
        {popup_visible === "genres" && (
          <ul className={styles.popup}>
            {genres_list.map((genre, idx) => {
              return (
                <li
                  key={idx}
                  className={styles.input_options}
                >
                  <input
                    type="radio"
                    id={genre}
                    name="primary_genre"
                    onChange={handle_input_change}
                    checked={song_data.song.primary_genre === genre}
                  />
                  <span className={styles.custom_checkbox}></span>
                  <label
                    htmlFor={genre}
                    className={styles.input_option}
                  >
                    &nbsp;&nbsp;{genre}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div
        ref={input_refs.mood_ref}
        className={`${styles.input_container} ${styles.container_moods}`}
      >
        <p className={styles.label}>Настроение</p>
        <div
          className={`${styles.input_field} ${
            !song_data.song.moods[0] && styles.input_default
          }`}
          onClick={() => handle_popup_visible("moods")}
        >
          {song_data.song.moods[0]
            ? song_data.song.moods[0]
            : "Настроение песни"}
          <GoTriangleDown
            className={`${styles.triangle_icon} ${
              popup_visible === "moods" && styles.popup_visible
            }`}
          />
        </div>
        {popup_visible === "moods" && (
          <ul className={styles.popup}>
            {moods_list.map((mood, idx) => {
              return (
                <li
                  key={idx}
                  className={styles.input_options}
                >
                  <input
                    type="radio"
                    id={mood}
                    name="moods"
                    onChange={handle_input_change}
                    checked={song_data.song.moods[0] === mood}
                  />
                  <span className={styles.custom_checkbox}></span>
                  <label
                    htmlFor={mood}
                    className={styles.input_option}
                  >
                    &nbsp;&nbsp;{mood}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className={styles.input_container}>
        <label
          htmlFor="price"
          className={styles.label}
        >
          Цена
        </label>
        <div className={styles.container_price}>
          <input
            type="text"
            name="price"
            id="price"
            placeholder="-"
            value={
              song_data.song.price
                ? format_input_price(song_data.song.price)
                : ""
            }
            autoComplete="off"
            inputMode="numeric"
            onChange={handle_input_change}
            className={styles.input_field}
          />
          <p style={{ marginLeft: ".75rem" }}>₽</p>
        </div>
      </div>
      {/* <div className={`${styles.input_container} ${styles.container_rating}`}>
        <label
          htmlFor="rating"
          className={styles.label}
        >
          Рейтинг
        </label>
        <input
          type="text"
          name="rating"
          id="rating"
          placeholder="0"
          value={song_data.song.rating ? song_data.song.rating : ""}
          autoComplete="off"
          onChange={handle_input_change}
          className={styles.input_field}
        />
      </div> */}
    </div>
  );
};

export default UploadStep3;
