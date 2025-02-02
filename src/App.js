// src/App.js
import React, { Suspense, useContext, useEffect, useState } from "react";
import Sidebar from "./layout/Sidebar";
import Content from "./layout/Content";
import Topbar from "./layout/Topbar";
import { Navigate, Route, Routes } from "react-router-dom";

import Blog from "./pages/Blog";

import Loader from "./components/Loader";

import axios from "axios";
import { ToastContainer } from "react-toastify";
import InclusivePage from "./components/InclusivePage";
import Login from "./pages/Login";
import { UserContext } from "./context/UserContext";

function getCookie(name) {
  const cookieString = decodeURIComponent(document.cookie);
  const cookies = cookieString.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }

  return null;
}

function App() {
  const { user, setLogin, load } = useContext(UserContext);

  axios.defaults.withCredentials = true;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.baseURL = "http://localhost:5000/api";

  axios.defaults.headers.common["authorization"] = `${getCookie("token")}`;

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      setLogin(true);
    } else {
      setLogin(false);
      delete axios.defaults.headers.common["Authorization"];
    }

    // Axios interceptor for handling 401 errors
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          setLogin(false);
          delete axios.defaults.headers.common["Authorization"];
          return <Navigate to="/" />;
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [setLogin]);

  return (
    <div className="App">
      {load && (
        <div className="load">
          <img src={require("./assets/images/logo.jpg")} alt="Admin" />
        </div>
      )}
      <ToastContainer autoClose={1000} />

      <Suspense fallback={<Loader />}>
        <Routes>
          {user ? (
            <>
              <Route
                path="/discover"
                element={
                  <InclusivePage
                    title={"Bloglar"}
                    name={"Blogları Yönet"}
                  >
                    <Blog />
                  </InclusivePage>
                }
              />
              <Route path="*" element={<Navigate to={"/discover"} />} />
            </>
          ) : (
            <>
              <Route index element={<Login setLogin={setLogin} />} />
              <Route path="*" element={<Navigate to={"/"} />} />
            </>
          )}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
