import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SubmitSong } from "../types";

export interface ISongData {
  song: SubmitSong;
}

const initial_state: ISongData = {
  song: {
    audio_object_key: "",
    cover_object_key: "",
    duration: 300,
    lyric: "",
    moods: [],
    name: "",
    price: "",
    primary_genre: "",
    sex: "male",
    key: "a_minor",
    secondary_genre: "поп",
    tempo: 100,
  },
};

const song_data_slice = createSlice({
  name: "song_data",
  initialState: initial_state,
  reducers: {
    set_song_data: (state: ISongData, actions: PayloadAction<SubmitSong>) => {
      state.song = actions.payload;
    },
  },
});

export const { set_song_data } = song_data_slice.actions;

export default song_data_slice.reducer;
