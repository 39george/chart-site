import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import MainLayout from "./Components/MainLayout";
import MainPage from "./Pages/MainPage";
import UploadOrEditPage from "./Pages/UploadOrEditPage";
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
import Login from "./Pages/Login";
import { set_is_loading, set_permissions } from "./state/permissions_slice";
import LoadingScreen from "./Components/LoadingScreen";

function App() {
  const is_loading = useSelector<RootState, boolean>(
    (state) => state.permissions.is_loading
  );
  const permissions_granted = useSelector<RootState, boolean>(
    (state) => state.permissions.premissions
  );
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
  const [genres_moods_fetching, set_genres_moods_fetching] = useState(false);
  const { error_data: fetch_genres_error, fetch_data: fetch_genres } =
    useAxios();
  const { error_data: fetch_moods_error, fetch_data: fetch_moods } = useAxios();
  const { fetch_data: fetch_healthcheck } = useAxios();

  async function get_healthcheck() {
    const response = await fetch_healthcheck({
      method: "GET",
      url: `${API_URL}/protected/health_check`,
    });
    if (response?.status === 200) {
      dispatch(set_permissions(true));
      dispatch(set_is_loading(false));
    } else {
      dispatch(set_permissions(false));
      dispatch(set_is_loading(false));
    }
  }

  async function get_genres_moods() {
    set_genres_moods_fetching(true);

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

    set_genres_moods_fetching(false);
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
    get_healthcheck();
    if (permissions_granted) {
      get_genres_moods();
    }
  }, [permissions_granted]);

  // Call Genres or Moods lists if they were changed
  useEffect(() => {
    async function refetch_genres() {
      set_genres_moods_fetching(true);
      const response = await get_genres_list();
      dispatch(set_genres_changed(false));
      set_genres_list(response);
      set_genres_moods_fetching(false);
    }

    async function refetch_moods() {
      set_genres_moods_fetching(true);
      const response = await get_moods_list();
      dispatch(set_moods_changed(false));
      set_moods_list(response);
      set_genres_moods_fetching(false);
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
          element={
            is_loading ? (
              <LoadingScreen />
            ) : permissions_granted ? (
              <MainLayout />
            ) : (
              <Login />
            )
          }
        >
          <Route
            index
            element={
              <MainPage
                genres_list={genres_list}
                moods_list={moods_list}
                fetch_genres_error={fetch_genres_error}
                fetch_moods_error={fetch_moods_error}
                genres_moods_fetching={genres_moods_fetching}
              />
            }
          />
          <Route
            path="upload_new_song"
            element={<UploadOrEditPage kind="upload" />}
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
          {/* <Route
            path="edit_song"
            element={<UploadOrEditPage kind="edit" />}
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
          </Route> */}
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
