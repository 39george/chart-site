import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GenresMoods } from "../types";

const initial_state: GenresMoods = {
  genres: [],
  moods: [],
};

const genres_moods_slice = createSlice({
  name: "genres_moods",
  initialState: initial_state,
  reducers: {
    set_genres: (state: GenresMoods, action: PayloadAction<string[]>) => {
      state.genres = action.payload;
    },
    set_moods: (state: GenresMoods, action: PayloadAction<string[]>) => {
      state.moods = action.payload;
    },
  },
});

export const { set_genres, set_moods } = genres_moods_slice.actions;

export default genres_moods_slice.reducer;
