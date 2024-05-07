import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

const userSessionStorage = JSON.parse(
  sessionStorage.getItem("user_data") ||
    JSON.stringify({
      isAuthenticated: false,
      user: {},
      incident: {},
    })
);

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(userSessionStorage);

  useEffect(() => {
    sessionStorage.setItem("user_data", JSON.stringify(user));
  }, [user]);

  const changeUser = (user, incident) => {
    setUser({
      isAuthenticated: true,
      user,
      incident,
    });
  };

  const signOut = () => {
    setUser({
      isAuthenticated: false,
      user: {},
      incident: {},
    });
  };

  return (
    <UserContext.Provider value={{ user, changeUser, signOut }}>
      {children}
    </UserContext.Provider>
  );
};
