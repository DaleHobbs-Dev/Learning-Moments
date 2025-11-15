// This Provider component wraps our entire app and manages the currentUser state.
// When the app loads, it checks localStorage for a logged-in user and fetches their full data from the API.
// It provides both currentUser (the data) and setCurrentUser (to update it) to all child components.
// This runs automatically on app load and whenever someone logs in/out.

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
