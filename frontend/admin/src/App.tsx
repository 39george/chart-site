import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import MainLayout from "./Components/MainLayout";
import MainPage from "./Pages/MainPage";
import UploadNewPage from "./Pages/UploadNewPage";
import UploadStep1 from "./Components/UploadStep1";
import UploadStep2 from "./Components/UploadStep2";
import UploadStep3 from "./Components/UploadStep3";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./state/store";
import { ISongData } from "./state/song_data_slice";
import useAxios from "./Hooks/APIRequests";
import { API_URL } from "./config";
import { useEffect, useState } from "react";
import UploadStep4 from "./Components/UploadStep4";
import {
  set_genres_changed,
  set_moods_changed,
} from "./state/genres_moods_changed_slice";

function App() {
  const song_data = useSelector<RootState, ISongData>(
    (state) => state.song_data
  );
  const genres_changed = useSelector<RootState, boolean>(
    (state) => state.genres_moods_changed.genres
  );
  const moods_changed = useSelector<RootState, boolean>(
    (state) => state.genres_moods_changed.moods
  );
  const dispatch = useDispatch();
  const [genres_list, set_genres_list] = useState<string[]>([]);
  const [moods_list, set_moods_list] = useState<string[]>([]);
  const { error_data: genres_error, fetch_data: fetch_genres } = useAxios();
  const { error_data: moods_error, fetch_data: fetch_moods } = useAxios();

  async function get_genres_moods() {
    try {
      const [genres, moods] = await Promise.all([
        get_genres_list(),
        get_moods_list(),
      ]);
      set_genres_list(genres);
      set_moods_list(moods);
    } catch (err) {
      console.error(err);
    }
  }

  async function get_genres_list() {
    const response = await fetch_genres({
      method: "GET",
      url: `${API_URL}/open/genres`,
    });
    if (response?.status === 200) {
      return response.data;
    }
  }

  async function get_moods_list() {
    const response = await fetch_moods({
      method: "GET",
      url: `${API_URL}/open/moods`,
    });
    if (response?.status === 200) {
      return response.data;
    }
  }

  // Call API
  useEffect(() => {
    get_genres_moods();
  }, []);

  // Call Genres or Moods lists if they were changed
  useEffect(() => {
    async function refetch_genres() {
      const response = await get_genres_list();
      dispatch(set_genres_changed(false));
      set_genres_list(response);
    }

    async function refetch_moods() {
      const response = await get_moods_list();
      dispatch(set_moods_changed(false));
      set_moods_list(response);
    }

    if (genres_changed) {
      refetch_genres();
    }
    if (moods_changed) {
      refetch_moods();
    }
  }, [genres_changed, moods_changed]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<MainLayout />}
        >
          <Route
            index
            element={
              <MainPage
                genres_list={genres_list}
                moods_list={moods_list}
              />
            }
          />
          <Route
            path="upload_new_song"
            element={<UploadNewPage />}
          >
            <Route
              path="step_1"
              element={<UploadStep1 />}
            />
            <Route
              path="step_2"
              element={<UploadStep2 song_data={song_data} />}
            />
            <Route
              path="step_3"
              element={
                <UploadStep3
                  song_data={song_data}
                  genres_list={genres_list}
                  moods_list={moods_list}
                />
              }
            />
            <Route
              path="step_4"
              element={<UploadStep4 song_data={song_data} />}
            />
            <Route
              index
              element={
                <Navigate
                  to="step_1"
                  replace
                />
              }
            />
          </Route>
        </Route>
        <Route
          path="*"
          element={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                margin: "2em 0",
              }}
            >
              <div
                style={{
                  width: "fit-content",
                  fontSize: "2rem",
                  fontWeight: "600",
                }}
              >
                страница не найдена
              </div>
              <Link
                to="/"
                style={{
                  marginTop: "2rem",
                  color: "white",
                }}
              >
                На главную
              </Link>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
