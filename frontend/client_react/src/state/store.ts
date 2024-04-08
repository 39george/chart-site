import { configureStore } from "@reduxjs/toolkit";
import checked_gender_reducer from "./checked_gender_slice";
import checked_genres_moods_reducer from "./checked_genres_moods_slice";
import genres_moods_reducer from "./genres_moods_slice";
import min_max_price_reducer from "./min_max_price_slice";
import price_value_reducer from "./price_value_slice";
import songs_reducer from "./songs_slice";

const store = configureStore({
  reducer: {
    checked_gender: checked_gender_reducer,
    checked_genres_moods: checked_genres_moods_reducer,
    genres_moods: genres_moods_reducer,
    min_max_price: min_max_price_reducer,
    price_value: price_value_reducer,
    songs: songs_reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AddDispatch = typeof store.dispatch;
export default store;
