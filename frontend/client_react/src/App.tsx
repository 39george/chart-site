import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import MainLayout from "./Components/MainLayout";
import MainPage from "./Pages/MainPage";
import ContactsPage from "./Pages/ContactsPage";
import useAxios from "./Hooks/APIRequests";
import { API_URL } from "./config";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { set_songs } from "./state/songs_slice";
import { set_genres, set_moods } from "./state/genres_moods_slice";
import { extract_genres, extract_moods } from "./helpers";
import { set_max_price, set_min_price } from "./state/min_max_price_slice";
import { ISong } from "./types";

function App() {
  const { fetch_data: fetch_songs } = useAxios();
  const dispatch = useDispatch();

  async function try_to_fetch_songs() {
    const response = await fetch_songs({
      method: "GET",
      url: `${API_URL}/open/songs`,
    });
    if (response?.status === 200) {
      let response_data: ISong[] = response.data;
      dispatch(set_songs([...response_data]));
      dispatch(set_genres(extract_genres(response_data)));
      dispatch(set_moods(extract_moods(response_data)));
      dispatch(
        set_max_price(
          Math.max.apply(
            Math,
            response_data.map((song) => Number.parseFloat(song.price))
          )
        )
      );
      dispatch(
        set_min_price(
          Math.min.apply(
            Math,
            response_data.map((song) => Number.parseFloat(song.price))
          )
        )
      );
    }
  }

  useEffect(() => {
    try_to_fetch_songs();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<MainLayout />}
        >
          <Route
            index
            element={<MainPage />}
          />
          <Route
            path="contacts"
            element={<ContactsPage />}
          />
          <Route
            path="*"
            element={
              <div
                style={{
                  width: "fit-content",
                  margin: "11rem auto 0",
                }}
              >
                Старница не найдена
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
