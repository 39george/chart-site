import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import MainLayout from "./Components/MainLayout";
import MainPage from "./Pages/MainPage";
import UploadNewPage from "./Pages/UploadNewPage";
import UploadStep1 from "./Components/UploadStep1";

function App() {
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
            path="upload_new_song"
            element={<UploadNewPage />}
          >
            <Route
              path="step_1"
              element={<UploadStep1 />}
            />
            <Route
              path="step_2"
              element={<div>step 2</div>}
            />
            <Route
              path="step_3"
              element={<div>step 3</div>}
            />
            <Route
              path="step_4"
              element={<div>step 4</div>}
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
