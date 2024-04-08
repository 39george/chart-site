import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CheckedGender, GenderOptions } from "../types";

const initial_state: CheckedGender = {
  checked: "Любой",
};

const checked_gender_slice = createSlice({
  name: "checked_gender",
  initialState: initial_state,
  reducers: {
    set_checked_gender: (
      state: CheckedGender,
      action: PayloadAction<GenderOptions>
    ) => {
      state.checked = action.payload;
    },
  },
});

export const { set_checked_gender } = checked_gender_slice.actions;

export default checked_gender_slice.reducer;
