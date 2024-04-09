import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  premissions: boolean;
  is_loading: boolean;
}

const initial_state: InitialState = {
  premissions: false,
  is_loading: true,
};

const permissions_slice = createSlice({
  name: "permissions",
  initialState: initial_state,
  reducers: {
    set_permissions: (state: InitialState, action: PayloadAction<boolean>) => {
      state.premissions = action.payload;
    },
    set_is_loading: (state: InitialState, action: PayloadAction<boolean>) => {
      state.is_loading = action.payload;
    },
  },
});

export const { set_permissions, set_is_loading } = permissions_slice.actions;

export default permissions_slice.reducer;
