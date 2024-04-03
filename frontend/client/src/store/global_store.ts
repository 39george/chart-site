import { createSignal } from "solid-js";
import { CheckedGender, CheckedGenresMoods } from "../types";

export const [checked_gender, set_checked_gender] = createSignal<CheckedGender>(
  {
    checked: "Любой",
  }
);
export const [checked_genres_moods, set_checked_genres_moods] =
  createSignal<CheckedGenresMoods>({
    genres: [],
    moods: [],
  });

export const [price_value, set_price_value] = createSignal({
  from: "",
  to: "",
});
