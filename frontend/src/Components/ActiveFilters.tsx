import styles from "./ActiveFitlers.module.scss";
import { Component, Index, createEffect, createSignal } from "solid-js";
import { IoCloseCircle, IoCloseOutline } from "solid-icons/io";
import { FilterType, GenderOptions } from "../types";

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

const ActiveFitlers: Component<ActiveFiltersProps> = (props) => {
  const [counters, set_counters] = createSignal({
    genres_counter: 0,
    moods_counter: 0,
  });

  createEffect(() => {
    set_counters(() => ({
      genres_counter: props.filters.genres.length - 2,
      moods_counter: props.filters.moods.length - 2,
    }));
  });

  return (
    <div class={styles.active_filters}>
      {props.filters.gender !== "Любой" && (
        <div class={styles.active_filter}>
          <span class={styles.filter_type}>Пол:&nbsp;&nbsp;</span>
          <span>{props.filters.gender}</span>
          <IoCloseOutline
            class={styles.clear_icon_outline}
            onClick={() => props.clear_filter("gender")}
          />
        </div>
      )}
      {props.filters.genres.length !== 0 && (
        <div class={styles.active_filter}>
          <span class={styles.filter_type}>Жанр:&nbsp;&nbsp;</span>
          <Index each={props.filters.genres}>
            {(genre, i) => {
              if (i === 0) {
                return <p>{genre()}</p>;
              }
              if (i === 1) {
                return <p>, {genre()}</p>;
              }
              if (i >= 2) {
                return;
              }
            }}
          </Index>
          {props.filters.genres.length >= 3 && (
            <p>, +{counters().genres_counter}</p>
          )}
          <IoCloseOutline
            class={styles.clear_icon_outline}
            onClick={() => props.clear_filter("genre")}
          />
        </div>
      )}
      {props.filters.moods.length !== 0 && (
        <div class={styles.active_filter}>
          <span class={styles.filter_type}>Настроение:&nbsp;&nbsp;</span>
          <Index each={props.filters.moods}>
            {(mood, i) => {
              if (i === 0) {
                return <p>{mood()}</p>;
              }
              if (i === 1) {
                return <p>, {mood()}</p>;
              }
              if (i >= 2) {
                return;
              }
            }}
          </Index>
          {props.filters.moods.length >= 3 && (
            <p>, +{counters().moods_counter}</p>
          )}
          <IoCloseOutline
            class={styles.clear_icon_outline}
            onClick={() => props.clear_filter("mood")}
          />
        </div>
      )}
      {props.filters.price.from !== "" && (
        <div class={styles.active_filter}>
          <span class={styles.filter_type}>Цена:&nbsp;&nbsp;</span>
          <span>{props.filters.price.from} - 120 000₽</span>
          <IoCloseOutline
            class={styles.clear_icon_outline}
            onClick={() => props.clear_filter("price")}
          />
        </div>
      )}
      {props.filters.gender !== "Любой" ||
      props.filters.price.from !== "" ||
      props.filters.genres.length !== 0 ||
      props.filters.moods.length !== 0 ? (
        <div
          class={styles.clear_filters}
          onClick={props.clear_filters}
        >
          <IoCloseCircle class={styles.clear_icon_circle} />
          <p>очистить фильтры</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ActiveFitlers;
