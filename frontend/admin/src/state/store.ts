import { configureStore } from "@reduxjs/toolkit";
import song_data_reducer from "./song_data_slice";
import genres_moods_changed_reducer from "./genres_moods_changed_slice";
import files_url_slice from "./files_url_slice";

const store = configureStore({
  reducer: {
    song_data: song_data_reducer,
    genres_moods_changed: genres_moods_changed_reducer,
    files_url: files_url_slice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AddDispatch = typeof store.dispatch;
export default store;
