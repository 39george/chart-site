import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  url: string;
}

const initial_state: InitialState = {
  url: "",
};

const song_url_slice = createSlice({
  name: "song_url",
  initialState: initial_state,
  reducers: {
    set_song_url: (state: InitialState, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
  },
});

export const { set_song_url } = song_url_slice.actions;

export default song_url_slice.reducer;
