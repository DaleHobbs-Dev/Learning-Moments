import React from "react";
import { useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import NavigationBar from "../components/NavigationBar/NavigationBar.jsx";
import { AllPosts } from "../components/AllPostsView/AllPosts.jsx";
import PostDetails from "../components/AllPostsView/PostDetails.jsx";
import { useCurrentUser } from "../context/CurrentUserContext.js";

export const ApplicationViews = () => {
  const { setCurrentUser } = useCurrentUser();

  useEffect(() => {
    const localLearningUser = localStorage.getItem("learning_user");
    const learningUserObject = JSON.parse(localLearningUser);
    setCurrentUser(learningUserObject);
  }, [setCurrentUser]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <NavigationBar />
            <Outlet />
          </>
        }
      >
        {/* <Route path="/register" element={<Register />} /> */}
        {/* Main feed */}
        <Route index element={<AllPosts />} />

        {/* Post details page */}
        <Route path="posts/:postId" element={<PostDetails />} />
        {/* Other routes can be added here */}
      </Route>
    </Routes>
  );
};
