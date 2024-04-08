import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  song_list_updated: boolean;
}

const initial_state: InitialState = {
  song_list_updated: false,
};

const song_list_updated_slice = createSlice({
  name: "song_list_updated",
  initialState: initial_state,
  reducers: {
    set_song_list_updated: (
      state: InitialState,
      action: PayloadAction<boolean>
    ) => {
      state.song_list_updated = action.payload;
    },
  },
});

export const { set_song_list_updated } = song_list_updated_slice.actions;

export default song_list_updated_slice.reducer;
