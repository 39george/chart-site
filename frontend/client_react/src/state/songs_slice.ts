import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ISong } from "../types";

interface InitialState {
  songs: ISong[];
  are_fetching: boolean;
}

const initial_state: InitialState = {
  songs: [],
  are_fetching: true,
};

const songs_slice = createSlice({
  name: "songs",
  initialState: initial_state,
  reducers: {
    set_songs: (state: InitialState, action: PayloadAction<ISong[]>) => {
      state.songs = action.payload;
    },
    set_are_songs_fetching: (
      state: InitialState,
      action: PayloadAction<boolean>
    ) => {
      state.are_fetching = action.payload;
    },
  },
});

export const { set_songs, set_are_songs_fetching } = songs_slice.actions;

export default songs_slice.reducer;
