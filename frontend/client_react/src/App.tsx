import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import MainLayout from "./Components/MainLayout";
import MainPage from "./Pages/MainPage";
import ContactsPage from "./Pages/ContactsPage";

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
