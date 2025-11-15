import { useState, useEffect } from "react";
import { useCurrentUser } from "../../context/CurrentUserContext.js";
import { getPostsWithTopicsLikesUsersByPostID } from '../../services/posts.js';
import { updatePost } from "../../services/posts.js";
import { useNavigate, useParams } from "react-router-dom";
import { getAllTopics, createTopic } from "../../services/topics.js";

// MUI imports
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
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

export default function EditPost() {

const { postId } = useParams();
const { currentUser } = useCurrentUser();

const [currentPost, setCurrentPost] = useState(null);
const [updatedPost, setUpdatedPost] = useState({
  title: "",
  userId: null,
  topicId: "",
  body: "",
  created: "",
});
const [topics, setTopics] = useState([]);
const [newTopicData, setNewTopicData] = useState({ name: "", description: "" });
const [loading, setLoading] = useState(false);
const [previewOpen, setPreviewOpen] = useState(false);
const userId = currentUser?.id || null;

// Navigation hook for redirecting after post creation
  const navigate = useNavigate();
  const [currentTopic, setCurrentTopic] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Update userId in newPostData when currentUser changes
  useEffect(() => {
    if (postId) {
      setCurrentPost(null); // Reset currentPost while loading new data
      getPostsWithTopicsLikesUsersByPostID(postId)
        .then((post) => {
          setCurrentPost(post);
          setUpdatedPost({
            title: post.title,
            userId: post.userId,
            topicId: post.topicId,
            body: post.body,
            created: post.created,
          });
          setCurrentTopic(post.topic || null);
        })
        .catch((error) => {
          console.error("Error fetching post for editing:", error);
        });
    }
  }, [postId]);

  // Fetch all topics on component mount
  useEffect(() => {
    getAllTopics()
      .then((data) => setTopics(data))
      .catch((error) => console.error("Error fetching topics:", error));
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update state based on input name. Alternative approach to reduce repetition
    switch (name) {
      // Depending on which field is changed, update the corresponding state value
      case "title":
      case "topicId":
      case "body":
        setUpdatedPost((prev) => ({ ...prev, [name]: value }));

        if (name === "topicId") {
          const selected = topics.find((t) => t.id === value);
          setCurrentTopic(selected || null);
        }
        break;

      case "customTopicName":
        setNewTopicData((prev) => ({ ...prev, name: value }));
        break;

      case "customTopicDescription":
        setNewTopicData((prev) => ({ ...prev, description: value }));
        break;

      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    // --- 1️⃣ Validate required fields ---
    if (!updatedPost.title.trim()) {
      alert("Please enter a title for your post.");
      setLoading(false);
      return;
    }

    if (!updatedPost.body.trim()) {
      alert("Please enter some content in the body.");
      setLoading(false);
      return;
    }

    if (
      updatedPost.topicId === "0" ||
      (updatedPost.topicId === "other" &&
        (!newTopicData.name.trim() || !newTopicData.description.trim()))
    ) {
      alert(
        "Please select a topic or enter a custom topic name and description."
      );
      setLoading(false);
      return;
    }

    try {
      let topicIdToUse = updatedPost.topicId;

      // --- 2️⃣ Create a new topic if needed ---
      if (topicIdToUse === "other") {
        const topicResponse = await createTopic({
          name: newTopicData.name.trim(),
          description: newTopicData.description.trim(),
        });
        topicIdToUse = topicResponse.id;
      }

      // --- 3️⃣ Update the post ---
      await updatePost(postId, {
        title: updatedPost.title.trim(),
        userId: userId,
        topicId: topicIdToUse,
        body: updatedPost.body.trim(),
        created: new Date().toISOString(),
      });

      // --- 4️⃣ Success feedback + redirect ---
      setSuccessMsg("Post updated successfully! Redirecting...");
      setTimeout(() => {
        setSuccessMsg("");
        navigate(`/my-posts`);
      }, 1500);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Something went wrong while creating your post. Please try again.");
    }

    // --- 5️⃣ Reset form ---
    setUpdatedPost({
      title: "",
      userId: userId,
      topicId: "0",
      body: "",
      created: new Date().toISOString(),
    });
    setNewTopicData({ name: "", description: "" });
    setCurrentTopic(null);
    setLoading(false);
  };

  const handleOpenPreview = () => {
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  if (!currentPost) {
  return (
    <Box p={4} textAlign="center">
      <CircularProgress />
    </Box>
  );
}

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: { xs: "100%", sm: "500px" },
          margin: "auto",
          mt: 4,
        }}
      >
        <Typography variant="h5" component="div" gutterBottom>
          Edit Post
        </Typography>

        <Typography variant="body2" color="textSecondary" gutterBottom>
          Update your post details below and click "Submit" to save changes.
        </Typography>

        {/* Text Input */}
        <TextField
          label="Title"
          variant="outlined"
          name="title"
          value={updatedPost.title ?? ""}
          onChange={handleChange}
          fullWidth
          placeholder="Enter a Title for the Post"
        />

        {/* Dropdown / Select */}
        <FormControl fullWidth>
          <InputLabel id="topic-label">Topic</InputLabel>
          <Select
            labelId="topic-label"
            label="Topic"
            name="topicId"
            value={updatedPost.topicId ?? ""}
            onChange={handleChange}
          >
            <MenuItem value={0} disabled>
              Choose a topic below
            </MenuItem>
            {topics.map((topic) => (
              <MenuItem key={topic.id} value={topic.id}>
                {topic.name}
              </MenuItem>
            ))}
            <MenuItem value="other">Other (Enter custom topic)</MenuItem>
          </Select>
        </FormControl>

        {/* Topic description */}
        {currentTopic && updatedPost.topicId !== "other" && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {currentTopic.description}
          </Typography>
        )}
        {/* Only show custom topic input if "Other" is chosen */}
        {updatedPost.topicId === "other" && (
          <>
            <TextField
              label="Custom Topic"
              variant="outlined"
              name="customTopicName"
              value={newTopicData.name || ""}
              onChange={handleChange}
              fullWidth
              placeholder="Enter your topic name"
              sx={{ mt: 2 }}
            />

            <TextField
              label="Custom Topic Description"
              variant="outlined"
              name="customTopicDescription"
              value={newTopicData.description || ""}
              onChange={handleChange}
              fullWidth
              placeholder="Enter your topic description"
              sx={{ mt: 2 }}
            />
          </>
        )}

        {/* Body Content */}
        <TextField
          label="Body"
          variant="outlined"
          name="body"
          value={updatedPost.body ?? ""}
          onChange={handleChange}
          fullWidth
          placeholder="Enter the content of the post (Markdown supported)"
          multiline
          minRows={4}
          sx={{ "& textarea": { resize: "vertical" } }}
        />

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          {/* Preview Button */}
          <Button
            variant="outlined"
            color="info"
            startIcon={<PreviewIcon />}
            onClick={handleOpenPreview}
            disabled={!updatedPost.body.trim()}
            sx={{ flex: 1 }}
          >
            Preview Post
          </Button>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={18} /> : <FavoriteIcon />
            }
            sx={{ flex: 1 }}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Box>

        {/* ✅ Success message */}
        {successMsg && (
          <Typography
            variant="body2"
            color="success.main"
            sx={{ mt: 1, textAlign: "center" }}
          >
            {successMsg}
          </Typography>
        )}
      </Box>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5">Post Preview</Typography>
        </DialogTitle>
        <DialogContent dividers>
          {/* Title Preview */}
          <Typography variant="h4" gutterBottom>
            <Box
              component="span"
              sx={{ fontWeight: 600, color: "primary.light", mr: 1 }}
            >
              Post Title:
            </Box>
            {updatedPost.title || "Untitled"}
          </Typography>

          {/* Author Preview */}
          <Typography variant="h6" gutterBottom>
            <Box
              component="span"
              sx={{ fontWeight: 600, color: "primary.light", mr: 1 }}
            >
              Author:
            </Box>
            {currentUser?.name || "You"}
          </Typography>

          {/* Body Preview with Markdown */}
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
                {updatedPost.body || "*No content yet*"}
              </ReactMarkdown>
            </Box>
          </Box>

          {/* Topic Preview */}
          {(currentTopic || updatedPost.topicId === "other") && (
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
                label={
                  updatedPost.topicId === "other"
                    ? newTopicData.name || "Custom Topic"
                    : currentTopic?.name || "No topic selected"
                }
                color="primary"
                size="small"
              />
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
  onClick={handleClosePreview}
  sx={{
    color: "primary.light",
    fontWeight: 600,
    transition: "0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(46, 125, 50, 0.25)", /* stronger green glow */
      color: "white",
      transform: "scale(1.03)",
      boxShadow: "0 0 10px rgba(46, 125, 50, 0.6)",
    },
  }}
>
  Close Preview
</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}