import cover_1 from "./assets/cover_1.jpg";
import cover_2 from "./assets/cover_2.jpg";
import { GenderOptions, ISong } from "./types";

export const genders: GenderOptions[] = ["Любой", "Мужской", "Женский"];

// function extract_genres(songs: ISong[]): string[] {
//   return Array.from(new Set(songs.map((song) => song.primary_genre)));
// }

// function extract_moods(songs: ISong[]): string[] {
//   return Array.from(new Set(songs.map((song) => song.moods).flat()));
// }

// export const genres = extract_genres(mock_songs);
// export const moods = extract_moods(mock_songs);
