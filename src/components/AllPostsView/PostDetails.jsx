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
import { useState, useEffect } from "react";
import { getPostsWithTopicsLikesUsersByPostID } from "../../services/posts.js";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "../../context/CurrentUserContext.js";
import { createLike } from "../../services/likes.js";
import { getLikesByPostId } from "../../services/likes.js";
import { useNavigate } from "react-router-dom";

// Markdown imports
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // Choose your preferred style

export default function PostDetails() {
  const { currentUser } = useCurrentUser();
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({});
  const [userPostsLikes, setUserPostsLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch post and likes whenever postId changes
  useEffect(() => {
    setLoading(true);

    // Fetch the post
    getPostsWithTopicsLikesUsersByPostID(postId)
      .then((data) => setPost(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

    // Fetch likes for this post
    getLikesByPostId(postId)
      .then((data) => setUserPostsLikes(data))
      .catch((error) => console.error("Error fetching likes for post:", error));
  }, [postId]);

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
        // Refresh likes after creating a new one
        getLikesByPostId(postId)
          .then((data) => setUserPostsLikes(data))
          .catch((error) =>
            console.error("Error fetching likes for post:", error)
          );
      })
      .catch((error) => console.error("Error creating like:", error));
  };

  const alreadyLiked = userPostsLikes.some(
    (like) => like.userId === currentUser?.id
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

        {/* --- Body with Markdown --- */}
        <Box sx={{ mt: 2 }}>
          <Typography
            component="span"
            sx={{ fontWeight: 600, color: "primary.light", mr: 1 }}
          >
            Content:
          </Typography>
          <Box
            sx={{
              mt: 1,
              "& p": { margin: "0.5em 0" },
              "& code": {
                backgroundColor: "#f5f5f5",
                padding: "2px 6px",
                borderRadius: "3px",
                fontSize: "0.9em",
                fontFamily: "monospace",
              },
              "& pre": {
                backgroundColor: "#f6f8fa",
                padding: "16px",
                borderRadius: "6px",
                overflow: "auto",
                margin: "1em 0",
              },
              "& pre code": {
                backgroundColor: "transparent",
                padding: 0,
              },
            }}
          >
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {post.body}
            </ReactMarkdown>
          </Box>
        </Box>

        {/* --- Topic --- */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
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
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                navigate(`/edit-post/${post.id}`);
              }}
            >
              Edit Post
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
