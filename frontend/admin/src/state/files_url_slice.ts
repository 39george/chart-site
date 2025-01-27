import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  audio: string;
  img: string;
}

const initial_state: InitialState = {
  audio: "",
  img: "",
};

const files_url_slice = createSlice({
  name: "files_url",
  initialState: initial_state,
  reducers: {
    set_audio_url: (state: InitialState, action: PayloadAction<string>) => {
      state.audio = action.payload;
    },
    set_img_url: (state: InitialState, action: PayloadAction<string>) => {
      state.img = action.payload;
    },
    reset_urls: () => {
      return initial_state;
    },
  },
});

export const { set_audio_url, set_img_url, reset_urls } =
  files_url_slice.actions;

export default files_url_slice.reducer;
