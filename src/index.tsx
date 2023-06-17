import React, { useContext } from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Todo from "./pages/Todo";
import Provider, { context } from "./components/Context/Provider";
import Login from "./pages/Login";
import NavBar from "./components/Navbar/Navbar";
import "./styles.css";
function App() {
  return (
    <div className="container">
      <BrowserRouter>
        {/* <Provider>
          <NavBar />
        </Provider> */}

        <div className="page-content">
          <Routes>
            <Route
              path="/"
              element={
                <Provider>
                  <Todo />
                </Provider>
              }
            />
            <Route
              path="/login"
              element={
                <Provider>
                  <Login />
                </Provider>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
