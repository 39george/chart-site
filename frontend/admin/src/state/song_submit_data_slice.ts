import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SubmitStatus } from "../types";

interface InitialState {
  submit_status: SubmitStatus;
}

const initial_state: InitialState = {
  submit_status: "",
};

const song_submit_data_slice = createSlice({
  name: "song_submit_status",
  initialState: initial_state,
  reducers: {
    set_song_submit_status: (
      state: InitialState,
      action: PayloadAction<SubmitStatus>
    ) => {
      state.submit_status = action.payload;
    },
  },
});

export const { set_song_submit_status } = song_submit_data_slice.actions;

export default song_submit_data_slice.reducer;
