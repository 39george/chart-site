import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ISong } from "../types";

interface InitialState {
  songs: ISong[];
}

const initial_state: InitialState = {
  songs: [],
};

const songs_slice = createSlice({
  name: "songs",
  initialState: initial_state,
  reducers: {
    set_songs: (state: InitialState, action: PayloadAction<ISong[]>) => {
      state.songs = action.payload;
    },
  },
});

export const { set_songs } = songs_slice.actions;

export default songs_slice.reducer;
