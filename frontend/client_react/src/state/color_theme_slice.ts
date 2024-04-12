import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ColorThemes } from "../types";

interface InitialState {
  theme: ColorThemes;
}

const initial_state: InitialState = {
  theme: "light",
};

const color_theme_slice = createSlice({
  name: "color_theme",
  initialState: initial_state,
  reducers: {
    set_theme: (state: InitialState, action: PayloadAction<ColorThemes>) => {
      state.theme = action.payload;
    },
  },
});

export const { set_theme } = color_theme_slice.actions;

export default color_theme_slice.reducer;
