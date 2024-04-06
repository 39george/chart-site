import { configureStore } from "@reduxjs/toolkit";
import files_uploaded_reducer from "./files_uploaded_slice";
import song_data_reducer from "./song_data_slice";

const store = configureStore({
  reducer: {
    files_uploaded: files_uploaded_reducer,
    song_data: song_data_reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AddDispatch = typeof store.dispatch;
export default store;
