import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  premissions: boolean;
}

const initial_state: InitialState = {
  premissions: false,
};

const permissions_slice = createSlice({
  name: "permissions",
  initialState: initial_state,
  reducers: {
    set_permissions: (state: InitialState, action: PayloadAction<boolean>) => {
      state.premissions = action.payload;
    },
  },
});

export const { set_permissions } = permissions_slice.actions;

export default permissions_slice.reducer;
