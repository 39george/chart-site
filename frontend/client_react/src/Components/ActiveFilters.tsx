import styles from "./ActiveFilters.module.scss";
import { IoCloseCircle, IoCloseOutline } from "react-icons/io5";
import { FilterType, GenderOptions } from "../types";
import { format_price } from "../helpers";
import { FC, useEffect, useState } from "react";
import { RootState } from "../state/store";
import { useSelector } from "react-redux";

interface ActiveFiltersProps {
  filters: {
    gender: GenderOptions;
    genres: string[];
    moods: string[];
    price: {
      from: string;
      to: string;
    };
  };
  clear_filters: () => void;
  clear_filter: (fitler: FilterType) => void;
}

const ActiveFitlers: FC<ActiveFiltersProps> = (props) => {
  const [counters, set_counters] = useState({
    genres_counter: 0,
    moods_counter: 0,
  });
  const MIN_PRICE = useSelector<RootState, number>(
    (state) => state.min_max_price.min
  );
  const MAX_PRICE = useSelector<RootState, number>(
    (state) => state.min_max_price.max
  );

  useEffect(() => {
    set_counters(() => ({
      genres_counter: props.filters.genres.length - 2,
      moods_counter: props.filters.moods.length - 2,
    }));
  }, [props.filters.genres, props.filters.moods]);

  return (
    <div className={styles.active_filters}>
      {props.filters.gender !== "Любой" && (
        <div className={styles.active_filter}>
          <span className={styles.filter_type}>Пол:&nbsp;&nbsp;</span>
          <span>
            {props.filters.gender === "female" ? "Женский" : "Мужской"}
          </span>
          <IoCloseOutline
            className={styles.clear_icon_outline}
            onClick={() => props.clear_filter("gender")}
          />
        </div>
      )}
      {props.filters.genres.length !== 0 && (
        <div className={styles.active_filter}>
          <span className={styles.filter_type}>Жанр:&nbsp;&nbsp;</span>
          {props.filters.genres.map((genre, idx) => {
            if (idx === 0) {
              return <p key={idx}>{genre}</p>;
            }
            if (idx === 1) {
              return <p key={idx}>, {genre}</p>;
            }
            if (idx >= 2) {
              return;
            }
          })}
          {props.filters.genres.length >= 3 && (
            <p>, +{counters.genres_counter}</p>
          )}
          <IoCloseOutline
            className={styles.clear_icon_outline}
            onClick={() => props.clear_filter("genre")}
          />
        </div>
      )}
      {props.filters.moods.length !== 0 && (
        <div className={styles.active_filter}>
          <span className={styles.filter_type}>Настроение:&nbsp;&nbsp;</span>
          {props.filters.moods.map((mood, idx) => {
            if (idx === 0) {
              return <p key={idx}>{mood}</p>;
            }
            if (idx === 1) {
              return <p key={idx}>, {mood}</p>;
            }
            if (idx >= 2) {
              return;
            }
          })}
          {props.filters.moods.length >= 3 && (
            <p>, +{counters.moods_counter}</p>
          )}
          <IoCloseOutline
            className={styles.clear_icon_outline}
            onClick={() => props.clear_filter("mood")}
          />
        </div>
      )}
      {props.filters.price.from !== "" || props.filters.price.to !== "" ? (
        <div className={styles.active_filter}>
          <span className={styles.filter_type}>Цена:&nbsp;&nbsp;</span>
          <span>
            {props.filters.price.from === ""
              ? format_price(MIN_PRICE.toString())
              : props.filters.price.from}
            ₽ -{" "}
            {props.filters.price.to === ""
              ? format_price(MAX_PRICE.toString())
              : props.filters.price.to}
            ₽
          </span>
          <IoCloseOutline
            className={styles.clear_icon_outline}
            onClick={() => props.clear_filter("price")}
          />
        </div>
      ) : (
        ""
      )}
      {props.filters.gender !== "Любой" ||
      props.filters.price.from !== "" ||
      props.filters.price.to !== "" ||
      props.filters.genres.length !== 0 ||
      props.filters.moods.length !== 0 ? (
        <div
          className={styles.clear_filters}
          onClick={props.clear_filters}
        >
          <IoCloseCircle className={styles.clear_icon_circle} />
          <p>очистить фильтры</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ActiveFitlers;
