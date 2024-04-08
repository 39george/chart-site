import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PriceValues } from "../types";

const initial_state: PriceValues = {
  from: "",
  to: "",
};

const price_value_slice = createSlice({
  name: "price_value",
  initialState: initial_state,
  reducers: {
    set_from_value: (state: PriceValues, action: PayloadAction<string>) => {
      state.from = action.payload;
    },
    set_to_value: (state: PriceValues, action: PayloadAction<string>) => {
      state.to = action.payload;
    },
  },
});

export const { set_from_value, set_to_value } = price_value_slice.actions;

export default price_value_slice.reducer;
