import { useState, useEffect } from "react";
import { useCurrentUser } from "../../context/CurrentUserContext.js";
import { getPostsWithTopicsLikesUsersByUserId } from "../../services/posts.js";
import { useNavigate } from "react-router-dom";

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

  const handlePreviewOpen = (content) => {
    setPreviewContent(content);
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setPreviewContent("");
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
          sx={{ mt: 2 }}
        >
          Create Your First Post
        </Button>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        My Posts
      </Typography>
      {myPosts.map((post) => (
        <Box
          key={post.id}
          mb={4}
          p={2}
          border={1}
          borderColor="grey.300"
          borderRadius={2}
        >
          <Typography variant="h5" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {post.content}
          </Typography>
          <Box display="flex" alignItems="center" mt={2}>
            <Chip
              icon={<FavoriteIcon />}
              label={post.likes}
              color="secondary"
              sx={{ mr: 2 }}
            />
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={() => handlePreviewOpen(post.content)}
            >
              Preview
            </Button>
          </Box>
        </Box>
      ))}

      <Dialog
        open={previewOpen}
        onClose={handlePreviewClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Post Preview</DialogTitle>
        <DialogContent dividers>
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {previewContent}
          </ReactMarkdown>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePreviewClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
