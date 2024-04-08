import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MinMaxValues } from "../types";

const initial_state: MinMaxValues = {
  min: 0,
  max: 0,
};

const min_max_price_slice = createSlice({
  name: "min_max",
  initialState: initial_state,
  reducers: {
    set_min_price: (state: MinMaxValues, action: PayloadAction<number>) => {
      state.min = action.payload;
    },
    set_max_price: (state: MinMaxValues, action: PayloadAction<number>) => {
      state.max = action.payload;
    },
  },
});

export const { set_min_price, set_max_price } = min_max_price_slice.actions;

export default min_max_price_slice.reducer;
