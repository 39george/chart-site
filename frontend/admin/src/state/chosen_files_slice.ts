import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FileParams } from "../types";

interface InitialState {
  audio: FileParams;
  img: FileParams;
}

const initial_state: InitialState = {
  audio: {
    media_type: "",
    file_name: "",
  },
  img: {
    media_type: "",
    file_name: "",
  },
};

const chosen_files_slice = createSlice({
  name: "chosen_files",
  initialState: initial_state,
  reducers: {
    set_chosen_audio_params: (
      state: InitialState,
      action: PayloadAction<FileParams>
    ) => {
      state.audio = action.payload;
    },
    set_chosen_img_params: (
      state: InitialState,
      action: PayloadAction<FileParams>
    ) => {
      state.img = action.payload;
    },
  },
});

export const { set_chosen_audio_params, set_chosen_img_params } =
  chosen_files_slice.actions;

export default chosen_files_slice.reducer;
