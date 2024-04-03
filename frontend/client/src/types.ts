export type GenderOptions = "Любой" | "Мужской" | "Женский";

export type FilterType = "gender" | "genre" | "mood" | "price" | null;

export interface ISong {
  cover_url: string;
  duration: number;
  id: number;
  lyric: string;
  name: string;
  price: string;
  primary_genre: string;
  moods: string[];
  raiting: number;
  sex: GenderOptions;
  created_at: string;
  key?: string;
  secondary_genre?: string;
  tempo?: string;
}

export interface CheckedGender {
  checked: GenderOptions;
}

export interface CheckedGenresMoods {
  genres: string[];
  moods: string[];
}
