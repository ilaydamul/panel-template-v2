import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState(false);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (login) {
      try {
        axios
          .get("/users")
          .then((response) => {
            if (response.data.loggedIn === true) {
              setUser({
                id: response.data.user.id,
                email: response.data.user.email,
              });
              setLogin(response.data.loggedIn);
            } else {
              setLogin(false);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [login, setUser, setLogin, load]);

  const logout = () => {
    Cookies.remove("token");
    window.location.pathname = "/";
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        setLogin,
        logout,
        load,
        setLoad,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};