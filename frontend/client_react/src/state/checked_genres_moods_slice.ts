import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GenresMoods } from "../types";

const initial_state: GenresMoods = {
  genres: [],
  moods: [],
};

const checked_genres_moods_slice = createSlice({
  name: "checked_genres_moods",
  initialState: initial_state,
  reducers: {
    set_checked_genres: (
      state: GenresMoods,
      action: PayloadAction<string[]>
    ) => {
      state.genres = action.payload;
    },
    set_checked_moods: (
      state: GenresMoods,
      action: PayloadAction<string[]>
    ) => {
      state.moods = action.payload;
    },
  },
});

export const { set_checked_genres, set_checked_moods } =
  checked_genres_moods_slice.actions;

export default checked_genres_moods_slice.reducer;
