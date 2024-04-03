// ───── SongsList types ──────────────────────────────────────────────────── //

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

// ───── UploadForm types ─────────────────────────────────────────────────── //

export enum CurrentStep {
  Step_1 = 1,
  Step_2 = 2,
  Step_3 = 3,
  Step_4 = 4,
}
