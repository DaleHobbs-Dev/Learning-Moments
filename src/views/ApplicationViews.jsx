import { useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import NavigationBar from "../components/NavigationBar/NavigationBar.jsx";
import { AllPosts } from "../components/AllPostsView/AllPosts.jsx";
import PostDetails from "../components/AllPostsView/PostDetails.jsx";
import { useCurrentUser } from "../context/CurrentUserContext.js";
import NewPost from "../components/NewPost/NewPost.jsx";
import { MyPosts } from "../components/MyPosts/MyPosts.jsx";
import EditPost from "../components/EditPost/EditPost.jsx";
import MyFavorites from "../components/MyFavorites/MyFavorites.jsx";
import { UserProfile } from "../components/UserProfile/UserProfile.jsx";

// Placeholder component for EditProfile
const EditProfile = () => {
  return (
    <div>
      <h2>Edit Profile</h2>
      <p>Edit profile component coming soon...</p>
    </div>
  );
};

export const ApplicationViews = () => {
  const { currentUser, setCurrentUser } = useCurrentUser(); // ✅ Get both values

  useEffect(() => {
    const localLearningUser = localStorage.getItem("learning_user");
    const learningUserObject = JSON.parse(localLearningUser);
    setCurrentUser(learningUserObject); // ✅ Now call setCurrentUser as a function
  }, [setCurrentUser]); // Also update the dependency

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
        {/* Main feed */}
        <Route index element={<AllPosts />} />

        {/* Post details page */}
        <Route path="posts/:postId" element={<PostDetails />} />
        <Route path="new-post" element={<NewPost />} />
        <Route path="my-posts" element={<MyPosts />} />

        {/* User profile routes */}
        <Route path="profile">
          <Route index element={<UserProfile userId={currentUser?.id} />} />
          <Route path="edit" element={<EditProfile />} />
          <Route path=":userId" element={<UserProfile />} />
        </Route>
        <Route path="edit-post/:postId" element={<EditPost />} />
        <Route path="my-favorites" element={<MyFavorites />} />
        {/* Other routes can be added here */}
      </Route>
    </Routes>
  );
};
