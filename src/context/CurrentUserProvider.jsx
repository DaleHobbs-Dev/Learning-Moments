import { useState, useEffect } from "react";
import { CurrentUserContext } from "./CurrentUserContext.js";

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const localUser = localStorage.getItem("learning_user");
    if (localUser) {
      setCurrentUser(JSON.parse(localUser));
    }
  }, []);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};
