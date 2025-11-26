import { useState, useEffect } from "react";
import { Typography, Button, Avatar, Box, Chip } from "@mui/material";
import { getPostsByUserIdExpandUsers } from "../../services/posts";
import styles from "./UserProfile.module.css";
import { getUserById } from "../../services/userService.js";
import { useParams, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../context/CurrentUserContext.js";

export const UserProfile = () => {
  // Get profileId from URL params and currentUser from context
  const { userId: profileId } = useParams();
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();

  // State to hold user data and posts
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Determine which user ID to use
  const userIdToFetch = profileId || currentUser?.id?.toString();

  useEffect(() => {
    // Don't fetch if we don't have a user ID yet
    if (!userIdToFetch) {
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch both user and posts in parallel
        const [fetchedUser, posts] = await Promise.all([
          getUserById(userIdToFetch),
          getPostsByUserIdExpandUsers(userIdToFetch),
        ]);

        setUser(fetchedUser);
        setUserPosts(posts);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userIdToFetch]); // Only depend on the final user ID

  // Show loading state while waiting for data
  if (loading || !user) {
    return (
      <Box className={styles.container}>
        <Box className={styles.profileCard}>
          <Typography variant="h5">Loading profile...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.profileCard}>
        <Typography variant="h4" className={styles.profileName} gutterBottom>
          {user.name}
        </Typography>

        <Typography variant="h6" className={styles.profileDetail}>
          Cohort:{" "}
          <span className={styles.profileDetailValue}>{user.cohort}</span>
        </Typography>

        <Typography variant="body1" className={styles.profileDetail}>
          Number of Posts:{" "}
          <span className={styles.profileDetailValue}>{userPosts.length}</span>
        </Typography>

        {/* Only show Edit Profile if this is the logged-in user's profile */}
        {currentUser &&
          (!profileId || profileId === currentUser.id.toString()) && (
            <Box className={styles.actionRow}>
              <Button
                variant="contained"
                onClick={() => navigate(`/profile/edit`)}
                className={styles.editButton}
              >
                Edit Profile
              </Button>
            </Box>
          )}
      </Box>
    </Box>
  );
};
