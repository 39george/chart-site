import { createSignal } from "solid-js";
import { CheckedGender, CheckedGenresMoods, ISong } from "../types";

export const [songs, set_songs] = createSignal<ISong[]>([]);

export const [checked_gender, set_checked_gender] = createSignal<CheckedGender>(
  {
    checked: "Любой",
  }
);

export const [genres_moods, set_genres_moods] =
  createSignal<CheckedGenresMoods>({
    genres: [],
    moods: [],
  });

export const [checked_genres_moods, set_checked_genres_moods] =
  createSignal<CheckedGenresMoods>({
    genres: [],
    moods: [],
  });

export const [price_value, set_price_value] = createSignal({
  from: "",
  to: "",
});

export const [MAX_PRICE, SET_MAX_PRICE] = createSignal(0);
export const [MIN_PRICE, SET_MIN_PRICE] = createSignal(0);
