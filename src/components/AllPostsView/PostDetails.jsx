import styles from "./AllPosts.module.css";
// MUI imports
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState, useEffect, useCallback } from "react";
import { getPostsWithTopicsLikesUsersByPostID } from "../../services/posts.js";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "../../context/CurrentUserContext.js";
import { createLike } from "../../services/likes.js";
import { getLikesByPostId } from "../../services/likes.js";

export default function PostDetails() {
  const { currentUser } = useCurrentUser();
  const { postId } = useParams();

  const [post, setPost] = useState({});
  const [userPostsLikes, setUserPostsLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  // helper to fetch likes for this post
  const getAndSetUserPostsLikes = useCallback(() => {
    getLikesByPostId(postId)
      .then((data) => setUserPostsLikes(data))
      .catch((error) => console.error("Error fetching likes for post:", error));
  }, [postId]);

  // 1) fetch the post itself
  useEffect(() => {
    setLoading(true);
    getPostsWithTopicsLikesUsersByPostID(postId)
      .then((data) => setPost(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [postId]);

  // 2) fetch likes for this post (run when postId changes / page loads)
  useEffect(() => {
    getAndSetUserPostsLikes();
  }, [getAndSetUserPostsLikes]);

  const handleLike = () => {
    if (!currentUser) {
      alert("You must be logged in to like a post.");
      return;
    }

    const newLikeObject = {
      userId: currentUser.id,
      postId: parseInt(postId, 10),
      likedAt: new Date().toISOString(),
    };

    console.log("Creating new like:", newLikeObject);

    createLike(newLikeObject)
      .then(() => {
        getAndSetUserPostsLikes();
      })
      .catch((error) => console.error("Error creating like:", error));
  };

  const alreadyLiked = userPostsLikes.some(
    (like) => like.userId === currentUser.id
  );

  if (loading) {
    return <Typography>Loading post...</Typography>;
  }

  if (!post || !post.id) {
    return (
      <Typography color="error.main" variant="body1">
        Sorry, this post could not be found.
      </Typography>
    );
  }

  return (
    <Card className={styles.postDetailsCard}>
      <CardContent>
        {/* --- Post title --- */}
        <Typography variant="h4" gutterBottom>
          <Box
            component="span"
            sx={{ fontWeight: 600, color: "primary.light", mr: 1 }}
          >
            Post Title:
          </Box>
          {post.title}
        </Typography>

        {/* --- Author --- */}
        <Typography variant="h4" gutterBottom>
          <Box
            component="span"
            sx={{ fontWeight: 600, color: "primary.light", mr: 1 }}
          >
            Author:
          </Box>
          {post.user?.name}
        </Typography>

        {/* --- Body --- */}
        <Typography variant="body1" paragraph>
          <Box
            component="span"
            sx={{ fontWeight: 600, color: "primary.light", mr: 1 }}
          >
            Content:
          </Box>
          {post.body}
        </Typography>

        {/* --- Topic --- */}
        <Typography variant="subtitle1" gutterBottom>
          <Box
            component="span"
            sx={{
              fontWeight: 600,
              color: "primary.light",
              mr: 1,
            }}
          >
            Topic:
          </Box>
          <Chip
            label={post.topic?.name || "Untitled Topic"}
            color="primary"
            size="small"
          />
        </Typography>

        {/* --- Likes row --- */}
        <Box mt={2} display="flex" alignItems="center">
          <FavoriteIcon color="error" />
          <Typography variant="body2" ml={1}>
            {userPostsLikes.length} Likes
          </Typography>
        </Box>

        {/* --- Action buttons (Like / Edit) --- */}
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          {/* If current user is NOT the author → show Like button */}
          {currentUser?.id !== post.userId && !alreadyLiked && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<FavoriteIcon />}
              onClick={() => handleLike()}
            >
              Like
            </Button>
          )}

          {/* If current user IS the author → show Edit button */}
          {currentUser?.id === post.userId && (
            <Button variant="outlined" color="primary" onClick={() => {}}>
              Edit Post
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
