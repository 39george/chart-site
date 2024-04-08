import { ISong } from "./types";

export const format_price = (number_string: string) => {
  return number_string.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export function extract_genres(songs: ISong[]): string[] {
  return Array.from(new Set(songs.map((song) => song.primary_genre)));
}

export function extract_moods(songs: ISong[]): string[] {
  return Array.from(new Set(songs.map((song) => song.moods).flat()));
}

// Wait func
export const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
