import { useState, useEffect } from "react";
import { useCurrentUser } from "../../context/CurrentUserContext.js";
import { getPostsWithTopicsLikesUsersByUserId, getPostsWithTopicsLikesUsersByPostID, deletePost } from "../../services/posts.js";
import { useNavigate, Link } from "react-router-dom";
import styles from "./MyPosts.module.css";

// MUI imports
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import { glowButton } from "../../styles/buttonGlow.js";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PreviewIcon from "@mui/icons-material/Preview";

// Markdown imports for preview
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

export const MyPosts = () => {
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();

  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [postToDelete, setPostToDelete] = useState(null);


  useEffect(() => {
    if (currentUser) {
      getPostsWithTopicsLikesUsersByUserId(currentUser.id)
        .then((posts) => {
          setMyPosts(posts);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user's posts:", error);
          setLoading(false);
        });
    }
  }, [currentUser]);

const handlePreviewOpen = async (postId) => {
  try {
    const fullPost = await getPostsWithTopicsLikesUsersByPostID(postId);
    setPreviewContent(fullPost);
    setPreviewOpen(true);
  } catch (error) {
    console.error("Error opening preview:", error);
  }
};

  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setPreviewContent("");
  };

  const handleDeleteClick = (post) => {
  setPostToDelete(post);
  setDeleteDialogOpen(true);
};

const handleConfirmDelete = async () => {
  if (!postToDelete) return;

  await deletePost(postToDelete.id);
  setMyPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));

  setDeleteDialogOpen(false);
  setPostToDelete(null);
};

const handleCancelDelete = () => {
  setDeleteDialogOpen(false);
  setPostToDelete(null);
};

  if (loading) {
    return (
      <Box p={4}>
        <CircularProgress />
      </Box>
    );
  } else if (myPosts.length === 0) {
    return (
      <Box p={4}>
        <Typography variant="h6">
          You have not created any posts yet.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/create-post")}
          sx={glowButton}
        >
          Create Your First Post
        </Button>
      </Box>
    );
  }

  return (
  <Box className={styles.container}>
    <Typography variant="h4" gutterBottom>
      My Posts
    </Typography>

    {myPosts.map((post) => (
      <Box key={post.id} className={styles.postCard}>
        <Typography
          variant="h5"
          component={Link}
          to={`/posts/${post.id}`}
          className={styles.postTitle}
          gutterBottom
        >
          {post.title}
        </Typography>

        <Typography variant="body1" className={styles.postBody}>
          {post.content}
        </Typography>

        <Box className={styles.actionRow}>
          <Chip
            icon={<FavoriteIcon />}
            label={post.likes}
            className={styles.likesChip}
          />

          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={() => handlePreviewOpen(post.id)}
            sx={glowButton}
          >
            Preview
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/edit-post/${post.id}`)}
            sx={glowButton}
          >
            Edit
          </Button>

          <Button
  variant="contained"
  color="error"
  onClick={() => handleDeleteClick(post)}
  sx={{
    ...glowButton,
    "&:hover": {
      backgroundColor: "rgba(255, 0, 0, 0.25)",
      transform: "scale(1.03)",
      boxShadow: "0 0 10px rgba(255, 50, 50, 0.7)",
      color: "white",
    },
  }}
>
  Delete
</Button>
        </Box>
      </Box>
    ))}
    {/* Preview Dialog */}
    <Dialog open={previewOpen} onClose={handlePreviewClose} maxWidth="md" fullWidth>
      <DialogTitle>Post Preview</DialogTitle>
      <DialogContent dividers className={styles.previewContent}>
  {previewContent ? (
    <>
      {/* Title */}
      <Typography variant="h5" gutterBottom>
        <strong style={{ color: "var(--color-primary-light)" }}>
          Title:
        </strong>{" "}
        {previewContent.title}
      </Typography>

      {/* Topic */}
      <Typography variant="subtitle1" gutterBottom>
        <strong style={{ color: "var(--color-primary-light)" }}>Topic:</strong>{" "}
        <Chip
          label={previewContent.topic?.name || "No Topic"}
          color="primary"
          size="small"
        />
      </Typography>

      {/* Likes */}
      <Typography variant="body2" gutterBottom>
        <strong style={{ color: "var(--color-primary-light)" }}>Likes:</strong>{" "}
        {previewContent.likes}
      </Typography>

      {/* Body - Markdown */}
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        <strong style={{ color: "var(--color-primary-light)" }}>Content:</strong>
      </Typography>

      <Box className={styles.previewMarkdownBox}>
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {previewContent.body}
        </ReactMarkdown>
      </Box>
    </>
  ) : (
    <Typography>Loading...</Typography>  )}
</DialogContent>
      <DialogActions>
        <Button onClick={handlePreviewClose} color="primary" sx={glowButton}>Close</Button>
      </DialogActions>
    </Dialog>

    {/* Delete Confirmation Dialog */}
    <Dialog
  open={deleteDialogOpen}
  onClose={handleCancelDelete}
  maxWidth="xs"
  fullWidth
>
  <DialogTitle>Confirm Delete</DialogTitle>

  <DialogContent dividers>
    <Typography>
      Are you sure you want to delete the post:
      <strong> {postToDelete?.title}</strong>?
    </Typography>
  </DialogContent>

  <DialogActions>
    <Button onClick={handleCancelDelete} sx={{ color: "primary.light" }}>
      Cancel
    </Button>

    <Button
      variant="contained"
      color="error"
      onClick={handleConfirmDelete}
      sx={{
        fontWeight: 600,
        color: "#fff",
        "&:hover": {
          backgroundColor: "rgba(255, 0, 0, 0.25)",
          boxShadow: "0 0 10px rgba(255, 50, 50, 0.7)",
        },
      }}
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>
  </Box>
);
};
