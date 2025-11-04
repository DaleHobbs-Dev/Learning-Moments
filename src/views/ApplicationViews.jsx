import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Register } from "../components/auth/Register.jsx";
import NavigationBar from "../components/NavigationBar/NavigationBar.jsx";
import { AllPosts } from "../components/AllPostsView/AllPosts.jsx";

export const ApplicationViews = () => {
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
        <Route index element={<AllPosts />} />
        {/* Other routes can be added here */}
      </Route>
    </Routes>
  );
};
