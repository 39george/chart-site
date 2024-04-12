export type GenderOptions = "Любой" | "male" | "female";

export type FilterType = "gender" | "genre" | "mood" | "price" | null;

export interface PriceValues {
  from: string;
  to: string;
}

export interface MinMaxValues {
  min: number;
  max: number;
}

export interface ISong {
  cover_url: string;
  duration: number;
  id: number;
  lyric: string;
  name: string;
  price: string;
  primary_genre: string;
  moods: string[];
  raiting: number | null;
  sex: GenderOptions;
  created_at: string;
  updated_at: string;
  key?: string;
  secondary_genre?: null;
  tempo?: number;
}

export interface CheckedGender {
  checked: GenderOptions;
}

export interface GenresMoods {
  genres: string[];
  moods: string[];
}

export type ColorThemes = "light" | "dark";
