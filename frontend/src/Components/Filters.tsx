import styles from "./Filters.module.scss";
import {
  Component,
  For,
  Show,
  createEffect,
  createSignal,
  onCleanup,
} from "solid-js";
import { FiChevronDown } from "solid-icons/fi";
import ActiveFitlers from "./ActiveFilters";
import { MAX_PRICE, MIN_PRICE, genders, genres, moods } from "../data";
import { FilterType, GenderOptions } from "../types";
import {
  checked_gender,
  checked_genres_moods,
  price_value,
  set_checked_gender,
  set_checked_genres_moods,
  set_price_value,
} from "../store/global_store";
import { format_price } from "../helpers";

interface FocusedFilter {
  focused: FilterType;
}

interface InputRefs {
  gender_ref: HTMLDivElement | undefined;
  genre_ref: HTMLDivElement | undefined;
  mood_ref: HTMLDivElement | undefined;
  price_ref: HTMLDivElement | undefined;
}

const Filters: Component = () => {
  const [focused_ref, set_focused_ref] = createSignal<
    HTMLDivElement | undefined
  >(undefined);
  const [focused_filter, set_focused_filter] = createSignal<FocusedFilter>({
    focused: null,
  });
  const input_refs: InputRefs = {
    gender_ref: undefined,
    genre_ref: undefined,
    mood_ref: undefined,
    price_ref: undefined,
  };
  let filters_to_choose_ref: HTMLDivElement | undefined;
  const number_format = new Intl.NumberFormat("ru");

  const handle_filter_click = (filter: FilterType) => {
    if (filter === focused_filter().focused) {
      set_focused_filter((prev) => ({
        ...prev,
        focused: null,
      }));
    } else {
      set_focused_filter((prev) => ({
        ...prev,
        focused: filter,
      }));
      switch (filter) {
        case "gender":
          set_focused_ref(input_refs.gender_ref);
          break;
        case "genre":
          set_focused_ref(input_refs.genre_ref);
          break;
        case "mood":
          set_focused_ref(input_refs.mood_ref);
          break;
        case "price":
          set_focused_ref(input_refs.price_ref);
          break;
      }
    }
  };

  const hanlde_checked_gender = (gender: GenderOptions) => {
    set_checked_gender(() => ({
      checked: gender,
    }));
  };

  const handle_checked_genres_moods = (
    filter_type: "genres" | "moods",
    item: string
  ) => {
    if (checked_genres_moods()[filter_type].includes(item)) {
      set_checked_genres_moods((prev) => ({
        ...prev,
        [filter_type]: checked_genres_moods()[filter_type].filter(
          (arr_item) => arr_item !== item
        ),
      }));
    } else {
      set_checked_genres_moods((prev) => ({
        ...prev,
        [filter_type]: [...prev[filter_type], item],
      }));
    }
  };

  const handle_change_price = (
    e: Event & { currentTarget: HTMLInputElement; target: HTMLInputElement }
  ) => {
    const name = e.target.name;

    let only_digit = e.target.value.replace(/[^\d]/g, "");
    if (only_digit) {
      let formatted_value = number_format.format(parseInt(only_digit, 10));
      set_price_value((prev) => ({
        ...prev,
        [name]: formatted_value,
      }));
    } else if (only_digit === "") {
      set_price_value((prev) => ({
        ...prev,
        [name]: "",
      }));
    } else {
      return;
    }
  };

  const clear_filters = () => {
    set_checked_gender(() => ({
      checked: "Любой",
    }));
    set_checked_genres_moods(() => ({
      genres: [],
      moods: [],
    }));
    set_price_value(() => ({
      from: "",
      to: "",
    }));
  };

  const clear_filter = (filter: FilterType) => {
    switch (filter) {
      case "gender":
        set_checked_gender(() => ({
          checked: "Любой",
        }));
        break;
      case "genre":
        set_checked_genres_moods((prev) => ({
          ...prev,
          genres: [],
        }));
        break;
      case "mood":
        set_checked_genres_moods((prev) => ({
          ...prev,
          moods: [],
        }));
        break;
      case "price":
        set_price_value(() => ({
          from: "",
          to: "",
        }));
        break;
    }
  };

  createEffect(() => {
    const handle_click_outside_filter = (e: MouseEvent) => {
      if (!focused_ref()?.contains(e.target as Node)) {
        set_focused_filter((prev) => ({
          ...prev,
          focused: null,
        }));
      }
    };

    document.addEventListener("mousedown", handle_click_outside_filter);

    onCleanup(() => {
      document.removeEventListener("mousedown", handle_click_outside_filter);
    });
  });

  return (
    <div class={styles.filters}>
      <div
        ref={filters_to_choose_ref}
        class={styles.filters_to_choose}
      >
        <p class={styles.header}>Фильтры</p>
        <div
          ref={input_refs.gender_ref}
          class={`${styles.filter} ${
            focused_filter().focused === "gender" && styles.focused_filter
          }`}
        >
          <div
            class={styles.filter_name}
            onClick={() => handle_filter_click("gender")}
          >
            <p>Пол</p>
            <FiChevronDown class={styles.chevron} />
          </div>
          <Show when={focused_filter().focused === "gender"}>
            <div class={styles.pop_up}>
              <ul class={styles.pop_up_content}>
                <li class={styles.pop_up_title}>Пол</li>
                <For each={genders}>
                  {(gender) => {
                    return (
                      <li class={styles.li_item}>
                        <input
                          type="checkbox"
                          id={gender}
                          checked={checked_gender().checked === gender}
                          onChange={() => hanlde_checked_gender(gender)}
                        />
                        <label
                          for={gender}
                          class={styles.label}
                        >
                          <span class={styles.custom_checkbox}></span>
                          {gender}
                        </label>
                      </li>
                    );
                  }}
                </For>
              </ul>
            </div>
          </Show>
        </div>
        <div
          ref={input_refs.genre_ref}
          class={`${styles.filter} ${
            focused_filter().focused === "genre" && styles.focused_filter
          }`}
        >
          <div
            class={styles.filter_name}
            onClick={() => handle_filter_click("genre")}
          >
            <p>Жанр</p>
            <FiChevronDown class={styles.chevron} />
          </div>
          <Show when={focused_filter().focused === "genre"}>
            <div class={`${styles.pop_up} ${styles.pop_up_genre}`}>
              <ul class={styles.pop_up_content}>
                <li class={styles.pop_up_title}>Жанр</li>
                <For each={genres}>
                  {(genre) => {
                    return (
                      <li class={styles.li_item}>
                        <input
                          type="checkbox"
                          id={genre}
                          checked={
                            checked_genres_moods().genres.indexOf(genre) === -1
                              ? false
                              : true
                          }
                          onChange={() =>
                            handle_checked_genres_moods("genres", genre)
                          }
                        />
                        <label
                          for={genre}
                          class={styles.label}
                        >
                          <span
                            class={`${styles.custom_checkbox} ${styles.checkbox_square}`}
                          ></span>
                          {genre}
                        </label>
                      </li>
                    );
                  }}
                </For>
              </ul>
            </div>
          </Show>
        </div>
        <div
          ref={input_refs.mood_ref}
          class={`${styles.filter} ${
            focused_filter().focused === "mood" && styles.focused_filter
          }`}
        >
          <div
            class={styles.filter_name}
            onClick={() => handle_filter_click("mood")}
          >
            <p>Настроение</p>
            <FiChevronDown class={styles.chevron} />
          </div>
          <Show when={focused_filter().focused === "mood"}>
            <div class={`${styles.pop_up} ${styles.pop_up_mood}`}>
              <ul class={styles.pop_up_content}>
                <li class={styles.pop_up_title}>Настроение</li>
                <For each={moods}>
                  {(mood) => {
                    return (
                      <li class={styles.li_item}>
                        <input
                          type="checkbox"
                          id={mood}
                          checked={
                            checked_genres_moods().moods.indexOf(mood) === -1
                              ? false
                              : true
                          }
                          onChange={() =>
                            handle_checked_genres_moods("moods", mood)
                          }
                        />
                        <label
                          for={mood}
                          class={styles.label}
                        >
                          <span
                            class={`${styles.custom_checkbox} ${styles.checkbox_square}`}
                          ></span>
                          {mood}
                        </label>
                      </li>
                    );
                  }}
                </For>
              </ul>
            </div>
          </Show>
        </div>
        <div
          ref={input_refs.price_ref}
          class={`${styles.filter} ${
            focused_filter().focused === "price" && styles.focused_filter
          }`}
        >
          <div
            class={styles.filter_name}
            onClick={() => handle_filter_click("price")}
          >
            <p>Цена</p>
            <FiChevronDown class={styles.chevron} />
          </div>
          <Show when={focused_filter().focused === "price"}>
            <div class={`${styles.pop_up} ${styles.pop_up_price}`}>
              <div class={styles.pop_up_content}>
                <p class={styles.pop_up_title}>Цена</p>
                <div class={styles.price_inputs}>
                  <input
                    class={`${styles.price_input} ${
                      price_value().from !== "" && styles.price_not_empty
                    }`}
                    type="text"
                    name="from"
                    inputMode="numeric"
                    id="from"
                    value={price_value().from}
                    placeholder={`${format_price(MIN_PRICE.toString())}₽`}
                    onInput={handle_change_price}
                  />
                  <p class={styles.price_to}>до</p>
                  <input
                    class={`${styles.price_input} ${
                      price_value().to !== "" && styles.price_not_empty
                    }`}
                    type="text"
                    name="to"
                    inputMode="numeric"
                    id="to"
                    value={price_value().to}
                    placeholder={`${format_price(MAX_PRICE.toString())}₽`}
                    onInput={handle_change_price}
                  />
                </div>
              </div>
            </div>
          </Show>
        </div>
      </div>
      <ActiveFitlers
        filters={{
          gender: checked_gender().checked,
          genres: checked_genres_moods().genres,
          moods: checked_genres_moods().moods,
          price: {
            from: price_value().from,
            to: price_value().to,
          },
        }}
        clear_filters={clear_filters}
        clear_filter={clear_filter}
      />
    </div>
  );
};

export default Filters;
