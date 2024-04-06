import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface FilesUploaded {
  audio: boolean;
  img: boolean;
}

const initial_state: FilesUploaded = {
  audio: false,
  img: false,
};

const files_uploaded_slice = createSlice({
  name: "files_uploaded",
  initialState: initial_state,
  reducers: {
    set_audio_file_uploaded: (
      state: FilesUploaded,
      action: PayloadAction<boolean>
    ) => {
      state.audio = action.payload;
    },
    set_img_file_uploaded: (
      state: FilesUploaded,
      action: PayloadAction<boolean>
    ) => {
      state.img = action.payload;
    },
  },
});

export const { set_audio_file_uploaded, set_img_file_uploaded } =
  files_uploaded_slice.actions;

export default files_uploaded_slice.reducer;
