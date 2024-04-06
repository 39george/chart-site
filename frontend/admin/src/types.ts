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

export type StepName = "step_1" | "step_2" | "step_3" | "step_4";

export interface IStep {
  path: StepName;
  active: boolean;
}

export interface ISteps {
  step_1: IStep;
  step_2: IStep;
  step_3: IStep;
  step_4: IStep;
}

export interface PresignedPostForm {
  url: string;
  fields: {
    policy: string;
    "X-Amz-Credential": string;
    "X-Amz-Date": string;
    "X-Amz-Algorithm": string;
    success_action_status: string;
    bucket: string;
    key: string;
    "Content-Type": string;
    "X-Amz-Signature": string;
    "Content-Disposition": string;
  };
}

export type Gender = "male" | "female";

export interface SubmitSong {
  audio_object_key: string;
  cover_object_key: string;
  duration?: number;
  key?: string;
  lyric: string;
  moods: string[];
  name: string;
  price: string;
  primary_genre: string;
  rating: number | null;
  secondary_genre?: string;
  sex: Gender;
  tempo?: number;
}

// ───── API Requests types ───────────────────────────────────────────────── //

export enum RequestMethods {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Delete = "DELETE",
}
