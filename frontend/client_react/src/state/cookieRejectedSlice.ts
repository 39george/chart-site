import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  isRejected: boolean;
}

const initialState: InitialState = {
  isRejected: false,
};

const cookieRejectedSlice = createSlice({
  name: "cookieRejected",
  initialState: initialState,
  reducers: {
    setCookieRejected: (
      state: InitialState,
      action: PayloadAction<boolean>
    ) => {
      state.isRejected = action.payload;
    },
  },
});

export const { setCookieRejected } = cookieRejectedSlice.actions;

export default cookieRejectedSlice.reducer;
