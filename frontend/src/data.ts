import cover_1 from "./assets/cover_1.jpg";
import cover_2 from "./assets/cover_2.jpg";
import { GenderOptions, ISong } from "./types";

export const songs: ISong[] = [
  {
    cover_url: cover_1,
    created_at: "some_date",
    duration: 209,
    id: 1,
    lyric: `Куплет 1 За окном до утра Говорили холода Говорили холода За мое все отдам В эти злые времена Все не стынет голова Ты просто 10 баллов Пробками до вокзала`,
    name: "Думала",
    price: "100000",
    primary_genre: "Поп",
    moods: ["Грустное"],
    raiting: 3,
    sex: "Женский",
  },
  {
    cover_url: cover_2,
    created_at: "some_date",
    duration: 209,
    id: 2,
    lyric: "some text",
    name: "Футболка",
    price: "120000",
    primary_genre: "Хип-хоп/RnB/Trap",
    moods: ["Свэг"],
    raiting: 2,
    sex: "Мужской",
  },
  {
    cover_url: cover_1,
    created_at: "some_date",
    duration: 209,
    id: 3,
    lyric: "some text",
    name: "Думала",
    price: "100000",
    primary_genre: "Поп",
    moods: ["Грустное"],
    raiting: 3,
    sex: "Женский",
  },
  {
    cover_url: cover_2,
    created_at: "some_date",
    duration: 209,
    id: 4,
    lyric: "some text",
    name: "Футболка",
    price: "120000",
    primary_genre: "Хип-хоп/RnB/Trap",
    moods: ["Свэг"],
    raiting: 2,
    sex: "Мужской",
  },
  {
    cover_url: cover_1,
    created_at: "some_date",
    duration: 209,
    id: 5,
    lyric: "some text",
    name: "Думала",
    price: "100000",
    primary_genre: "Поп-рок",
    moods: ["Грустное"],
    raiting: 3,
    sex: "Женский",
  },
  {
    cover_url: cover_2,
    created_at: "some_date",
    duration: 209,
    id: 6,
    lyric: "some text",
    name: "Футболка",
    price: "120000",
    primary_genre: "Хип-хоп/RnB/Trap",
    moods: ["Свэг"],
    raiting: 2,
    sex: "Мужской",
  },
  {
    cover_url: cover_1,
    created_at: "some_date",
    duration: 209,
    id: 7,
    lyric: "some text",
    name: "Думала",
    price: "100000",
    primary_genre: "Поп",
    moods: ["Грустное"],
    raiting: 3,
    sex: "Женский",
  },
  {
    cover_url: cover_2,
    created_at: "some_date",
    duration: 209,
    id: 8,
    lyric: "some text",
    name: "Футболка",
    price: "120000",
    primary_genre: "Хип-хоп/RnB/Trap",
    moods: ["Свэг"],
    raiting: 2,
    sex: "Мужской",
  },
  {
    cover_url: cover_1,
    created_at: "some_date",
    duration: 209,
    id: 9,
    lyric: "some text",
    name: "Думала",
    price: "100000",
    primary_genre: "Поп",
    moods: ["Грустное"],
    raiting: 3,
    sex: "Женский",
  },
  {
    cover_url: cover_2,
    created_at: "some_date",
    duration: 209,
    id: 10,
    lyric: "some text",
    name: "Футболка",
    price: "120000",
    primary_genre: "Шансон",
    moods: ["Свэг"],
    raiting: 2,
    sex: "Мужской",
  },
];
export const genders: GenderOptions[] = ["Любой", "Мужской", "Женский"];

const init_genres = [
  "Поп",
  "Поп-рок",
  "Танцевальная",
  "Хип-хоп/RnB/Trap",
  "Шансон",
];

const init_moods = ["Веселое", "Грустное", "Свэг"];

function filter_genres_moods(
  songs: ISong[],
  type: "genres" | "moods"
): string[] {
  let result: string[] = [];
  switch (type) {
    case "genres":
      songs
        .filter((song) => init_genres.includes(song.primary_genre))
        .forEach((song) => {
          if (!result.includes(song.primary_genre)) {
            result.push(song.primary_genre);
          }
        });
      return result;
    case "moods":
      songs
        .filter((song) => init_moods.includes(song.moods[0]))
        .forEach((song) => {
          if (!result.includes(song.moods[0])) {
            result.push(song.moods[0]);
          }
        });
      return result;
  }
  return result;
}

export const genres = filter_genres_moods(songs, "genres");
export const moods = filter_genres_moods(songs, "moods");
