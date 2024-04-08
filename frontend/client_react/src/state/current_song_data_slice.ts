import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  id: number;
  is_palying: boolean;
}

const initial_state: InitialState = {
  id: -1,
  is_palying: false,
};

const current_song_data_slice = createSlice({
  name: "current_song_data",
  initialState: initial_state,
  reducers: {
    set_current_song_id: (
      state: InitialState,
      action: PayloadAction<number>
    ) => {
      state.id = action.payload;
    },
    set_current_song_playing: (
      state: InitialState,
      action: PayloadAction<boolean>
    ) => {
      state.is_palying = action.payload;
    },
  },
});

export const { set_current_song_id, set_current_song_playing } =
  current_song_data_slice.actions;

export default current_song_data_slice.reducer;
