import { configureStore } from "@reduxjs/toolkit";
import song_data_reducer from "./song_data_slice";
import genres_moods_changed_reducer from "./genres_moods_changed_slice";
import files_url_reducer from "./files_url_slice";
import song_submit_data_reducer from "./song_submit_data_slice";
import song_list_updated_reducer from "./song_list_updated_slice";
import permissions_reducer from "./permissions_slice";

const store = configureStore({
  reducer: {
    song_data: song_data_reducer,
    genres_moods_changed: genres_moods_changed_reducer,
    files_url: files_url_reducer,
    song_submit_data: song_submit_data_reducer,
    song_list_updated: song_list_updated_reducer,
    permissions: permissions_reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AddDispatch = typeof store.dispatch;
export default store;
