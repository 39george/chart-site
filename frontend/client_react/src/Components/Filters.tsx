import styles from "./Filters.module.scss";
import { IoChevronDown } from "react-icons/io5";
import ActiveFitlers from "./ActiveFilters";
import { genders } from "../data";
import { FilterType, GenderOptions, GenresMoods, PriceValues } from "../types";
import { format_price } from "../helpers";
import { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { set_checked_gender } from "../state/checked_gender_slice";
import { RootState } from "../state/store";
import {
  set_checked_genres,
  set_checked_moods,
} from "../state/checked_genres_moods_slice";
import { set_from_value, set_to_value } from "../state/price_value_slice";

// ───── Type declarations ────────────────────────────────────────────────── //

// An interface that contains info of a currently clicked filter
interface FocusedFilter {
  focused: FilterType;
}

// An interface with references to DOM filter elements
interface InputRefs {
  gender_ref: React.RefObject<HTMLDivElement>;
  genre_ref: React.RefObject<HTMLDivElement>;
  mood_ref: React.RefObject<HTMLDivElement>;
  price_ref: React.RefObject<HTMLDivElement>;
}

// ───── Component ────────────────────────────────────────────────────────── //

const Filters: FC = () => {
  const [focused_ref, set_focused_ref] = useState<HTMLDivElement>();
  const [focused_filter, set_focused_filter] = useState<FocusedFilter>({
    focused: null,
  });
  const input_refs: InputRefs = {
    gender_ref: useRef(null),
    genre_ref: useRef(null),
    mood_ref: useRef(null),
    price_ref: useRef(null),
  };
  const number_format = new Intl.NumberFormat("ru");
  const dispatch = useDispatch();
  const MIN_PRICE = useSelector<RootState, number>(
    (state) => state.min_max_price.min
  );
  const MAX_PRICE = useSelector<RootState, number>(
    (state) => state.min_max_price.max
  );
  const price_value = useSelector<RootState, PriceValues>(
    (state) => state.price_value
  );
  const genres_moods = useSelector<RootState, GenresMoods>(
    (state) => state.genres_moods
  );
  const checked_gender = useSelector<RootState, GenderOptions>(
    (state) => state.checked_gender.checked
  );
  const checked_genres_moods = useSelector<RootState, GenresMoods>(
    (state) => state.checked_genres_moods
  );

  // Handling click on filter to open corresponding popup menu
  function handle_filter_click(filter: FilterType) {
    if (filter === focused_filter.focused) {
      set_focused_filter(() => ({
        focused: null,
      }));
    } else {
      set_focused_filter(() => ({
        focused: filter,
      }));

      switch (filter) {
        case "gender":
          if (input_refs.gender_ref.current) {
            set_focused_ref(input_refs.gender_ref.current);
          }
          break;
        case "genre":
          if (input_refs.genre_ref.current) {
            set_focused_ref(input_refs.genre_ref.current);
          }
          break;
        case "mood":
          if (input_refs.mood_ref.current) {
            set_focused_ref(input_refs.mood_ref.current);
          }
          break;
        case "price":
          if (input_refs.price_ref.current) {
            set_focused_ref(input_refs.price_ref.current);
          }
          break;
      }
    }
  }

  // Toggling checked gender
  function hanlde_checked_gender(gender: GenderOptions) {
    dispatch(set_checked_gender(gender));
  }

  // Handling checked genres/moods. Push the item to checked array if it isn't
  // present; filter items without the item, if it is present
  function handle_checked_genres_moods(
    filter_type: "genres" | "moods",
    item: string
  ) {
    switch (filter_type) {
      case "genres":
        if (checked_genres_moods.genres.includes(item)) {
          dispatch(
            set_checked_genres(
              checked_genres_moods.genres.filter((genre) => genre !== item)
            )
          );
        } else {
          dispatch(set_checked_genres([...checked_genres_moods.genres, item]));
        }
        break;
      case "moods":
        if (checked_genres_moods.moods.includes(item)) {
          dispatch(
            set_checked_moods(
              checked_genres_moods.moods.filter((genre) => genre !== item)
            )
          );
        } else {
          dispatch(set_checked_moods([...checked_genres_moods.moods, item]));
        }
        break;
    }
  }

  // Handling and formatting input prices
  function handle_change_price(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;

    let only_digit = e.target.value.replace(/[^\d]/g, "");
    if (only_digit) {
      let formatted_value = number_format.format(parseInt(only_digit, 10));

      switch (name) {
        case "from":
          dispatch(set_from_value(formatted_value));
          break;
        case "to":
          dispatch(set_to_value(formatted_value));
          break;
      }
    } else if (only_digit === "") {
      switch (name) {
        case "from":
          dispatch(set_from_value(""));
          break;
        case "to":
          dispatch(set_to_value(""));
          break;
      }
    } else {
      return;
    }
  }

  function clear_filters() {
    dispatch(set_checked_gender("Любой"));
    dispatch(set_checked_genres([]));
    dispatch(set_checked_moods([]));
    dispatch(set_from_value(""));
    dispatch(set_to_value(""));
  }

  function clear_filter(filter: FilterType) {
    switch (filter) {
      case "gender":
        dispatch(set_checked_gender("Любой"));
        break;
      case "genre":
        dispatch(set_checked_genres([]));
        break;
      case "mood":
        dispatch(set_checked_moods([]));
        break;
      case "price":
        dispatch(set_from_value(""));
        dispatch(set_to_value(""));
        break;
    }
  }

  useEffect(() => {
    const handle_click_outside_filter = (e: MouseEvent) => {
      if (!focused_ref?.contains(e.target as Node)) {
        set_focused_filter(() => ({
          focused: null,
        }));
      }
    };

    document.addEventListener("mousedown", handle_click_outside_filter);

    return () => {
      document.removeEventListener("mousedown", handle_click_outside_filter);
    };
  }, [focused_ref]);

  return (
    <div className={styles.filters}>
      <div className={styles.filters_to_choose}>
        <p className={styles.header}>Фильтры</p>
        <div
          ref={input_refs.gender_ref}
          className={`${styles.filter} ${
            focused_filter.focused === "gender" && styles.focused_filter
          }`}
        >
          <div
            className={styles.filter_name}
            onClick={() => handle_filter_click("gender")}
          >
            <p>Пол</p>
            <IoChevronDown className={styles.chevron} />
          </div>
          {focused_filter.focused === "gender" && (
            <div className={styles.pop_up}>
              <ul className={styles.pop_up_content}>
                <li className={styles.pop_up_title}>Пол</li>
                {genders.map((gender, idx) => {
                  return (
                    <li
                      key={idx}
                      className={styles.li_item}
                    >
                      <input
                        type="checkbox"
                        id={gender}
                        checked={checked_gender === gender}
                        onChange={() => hanlde_checked_gender(gender)}
                      />
                      <label
                        htmlFor={gender}
                        className={styles.label}
                      >
                        <span className={styles.custom_checkbox}></span>
                        {gender === "Любой"
                          ? gender
                          : gender === "female"
                          ? "Женский"
                          : "Мужской"}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <div
          ref={input_refs.genre_ref}
          className={`${styles.filter} ${
            focused_filter.focused === "genre" && styles.focused_filter
          }`}
        >
          <div
            className={styles.filter_name}
            onClick={() => handle_filter_click("genre")}
          >
            <p>Жанр</p>
            <IoChevronDown className={styles.chevron} />
          </div>
          {focused_filter.focused === "genre" && (
            <div className={`${styles.pop_up} ${styles.pop_up_genre}`}>
              <ul className={styles.pop_up_content}>
                <li className={styles.pop_up_title}>Жанр</li>
                {genres_moods.genres.map((genre, idx) => {
                  return (
                    <li
                      key={idx}
                      className={styles.li_item}
                    >
                      <input
                        type="checkbox"
                        id={genre}
                        checked={
                          checked_genres_moods.genres.indexOf(genre) === -1
                            ? false
                            : true
                        }
                        onChange={() =>
                          handle_checked_genres_moods("genres", genre)
                        }
                      />
                      <label
                        htmlFor={genre}
                        className={styles.label}
                      >
                        <span
                          className={`${styles.custom_checkbox} ${styles.checkbox_square}`}
                        ></span>
                        {genre}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <div
          ref={input_refs.mood_ref}
          className={`${styles.filter} ${
            focused_filter.focused === "mood" && styles.focused_filter
          }`}
        >
          <div
            className={styles.filter_name}
            onClick={() => handle_filter_click("mood")}
          >
            <p>Настроение</p>
            <IoChevronDown className={styles.chevron} />
          </div>
          {focused_filter.focused === "mood" && (
            <div className={`${styles.pop_up} ${styles.pop_up_mood}`}>
              <ul className={styles.pop_up_content}>
                <li className={styles.pop_up_title}>Настроение</li>
                {genres_moods.moods.map((mood, idx) => {
                  return (
                    <li
                      key={idx}
                      className={styles.li_item}
                    >
                      <input
                        type="checkbox"
                        id={mood}
                        checked={
                          checked_genres_moods.moods.indexOf(mood) === -1
                            ? false
                            : true
                        }
                        onChange={() =>
                          handle_checked_genres_moods("moods", mood)
                        }
                      />
                      <label
                        htmlFor={mood}
                        className={styles.label}
                      >
                        <span
                          className={`${styles.custom_checkbox} ${styles.checkbox_square}`}
                        ></span>
                        {mood}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <div
          ref={input_refs.price_ref}
          className={`${styles.filter} ${
            focused_filter.focused === "price" && styles.focused_filter
          }`}
        >
          <div
            className={styles.filter_name}
            onClick={() => handle_filter_click("price")}
          >
            <p>Цена</p>
            <IoChevronDown className={styles.chevron} />
          </div>
          {focused_filter.focused === "price" && (
            <div className={`${styles.pop_up} ${styles.pop_up_price}`}>
              <div className={styles.pop_up_content}>
                <p className={styles.pop_up_title}>Цена</p>
                <div className={styles.price_inputs}>
                  <input
                    className={`${styles.price_input} ${
                      price_value.from !== "" && styles.price_not_empty
                    }`}
                    type="text"
                    name="from"
                    inputMode="numeric"
                    id="from"
                    value={price_value.from}
                    autoComplete="off"
                    placeholder={`${format_price(MIN_PRICE.toString())}₽`}
                    onChange={handle_change_price}
                  />
                  <p className={styles.price_to}>до</p>
                  <input
                    className={`${styles.price_input} ${
                      price_value.to !== "" && styles.price_not_empty
                    }`}
                    type="text"
                    name="to"
                    inputMode="numeric"
                    id="to"
                    value={price_value.to}
                    autoComplete="off"
                    placeholder={`${format_price(MAX_PRICE.toString())}₽`}
                    onChange={handle_change_price}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ActiveFitlers
        filters={{
          gender: checked_gender,
          genres: checked_genres_moods.genres,
          moods: checked_genres_moods.moods,
          price: {
            from: price_value.from,
            to: price_value.to,
          },
        }}
        clear_filters={clear_filters}
        clear_filter={clear_filter}
      />
    </div>
  );
};

export default Filters;
