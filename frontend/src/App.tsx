import { Route, Router } from "@solidjs/router";
import "./App.scss";
import Navbar from "./Components/Navbar";
import MainPage from "./Pages/MainPage";
import ContactsPage from "./Pages/ContactsPage";

function App() {
  return (
    <>
      <Router root={Navbar}>
        <Route
          path="/"
          component={MainPage}
        />
        <Route
          path="/contacts"
          component={ContactsPage}
        />
      </Router>
    </>
  );
}

export default App;
