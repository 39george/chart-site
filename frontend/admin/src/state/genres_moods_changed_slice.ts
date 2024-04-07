import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  genres: boolean;
  moods: boolean;
}

const initial_state: InitialState = {
  genres: false,
  moods: false,
};

const genres_moods_changed_slice = createSlice({
  name: "genres_moods_changed",
  initialState: initial_state,
  reducers: {
    set_genres_changed: (
      state: InitialState,
      actions: PayloadAction<boolean>
    ) => {
      state.genres = actions.payload;
    },
    set_moods_changed: (
      state: InitialState,
      actions: PayloadAction<boolean>
    ) => {
      state.moods = actions.payload;
    },
  },
});

export const { set_genres_changed, set_moods_changed } =
  genres_moods_changed_slice.actions;

export default genres_moods_changed_slice.reducer;
