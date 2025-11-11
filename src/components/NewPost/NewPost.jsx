import { useState, useEffect } from "react";
import { useCurrentUser } from "../../context/CurrentUserContext.js";
//import styles from "./NewPost.module.css";
import { getAllTopics, createTopic } from "../../services/topics.js";
import { createPost } from "../../services/posts.js";
import { useNavigate } from "react-router-dom";

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
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function NewPost() {
  const userId = useCurrentUser().currentUser.id;
  const navigate = useNavigate();

  console.log("Current User ID in NewPost:", userId);

  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [newPostData, setNewPostData] = useState({
    title: "",
    userId: userId,
    topicId: "",
    body: "",
    created: new Date().toISOString(),
  });
  const [newTopicData, setNewTopicData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (userId) {
      setNewPostData((prev) => ({ ...prev, userId }));
    }
  }, [userId]);

  useEffect(() => {
    getAllTopics()
      .then((data) => setTopics(data))
      .catch((error) => console.error("Error fetching topics:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "title":
      case "topicId":
      case "body":
        setNewPostData((prev) => ({ ...prev, [name]: value }));

        if (name === "topicId") {
          const selected = topics.find((t) => t.id === value);
          setSelectedTopic(selected || null);
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
    if (!newPostData.title.trim()) {
      alert("Please enter a title for your post.");
      setLoading(false);
      return;
    }

    if (!newPostData.body.trim()) {
      alert("Please enter some content in the body.");
      setLoading(false);
      return;
    }

    if (
      newPostData.topicId === "0" || // nothing selected
      (newPostData.topicId === "other" &&
        (!newTopicData.name.trim() || !newTopicData.description.trim()))
    ) {
      alert(
        "Please select a topic or enter a custom topic name and description."
      );
      setLoading(false);
      return;
    }

    try {
      let topicIdToUse = newPostData.topicId;

      // --- 2️⃣ Create a new topic if needed ---
      if (topicIdToUse === "other") {
        const topicResponse = await createTopic({
          name: newTopicData.name.trim(),
          description: newTopicData.description.trim(),
        });
        topicIdToUse = topicResponse.id;
      }

      // --- 3️⃣ Create the post ---
      const postResponse = await createPost({
        title: newPostData.title.trim(),
        userId: userId,
        topicId: topicIdToUse,
        body: newPostData.body.trim(),
        created: new Date().toISOString(),
      });

      // --- 4️⃣ Success feedback + redirect ---
      setSuccessMsg("Post created successfully! Redirecting...");
      setTimeout(() => {
        setSuccessMsg("");
        navigate(`/posts/${postResponse.id}`);
      }, 1500);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Something went wrong while creating your post. Please try again.");
    }

    // --- 5️⃣ Reset form ---
    setNewPostData({
      title: "",
      userId: userId,
      topicId: "0",
      body: "",
      created: new Date().toISOString(),
    });
    setNewTopicData({ name: "", description: "" });
    setSelectedTopic(null);
    setLoading(false);
  };

  return (
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
        Create New Post
      </Typography>

      <Typography variant="body2" color="textSecondary" gutterBottom>
        Choose a topic from the dropdown below or create a new topic. Then fill
        out the title and body of your post before submitting.
      </Typography>

      {/* Text Input */}
      <TextField
        label="Title"
        variant="outlined"
        name="title"
        value={newPostData.title}
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
          value={newPostData.topicId}
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
      {selectedTopic && newPostData.topicId !== "other" && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {selectedTopic.description}
        </Typography>
      )}

      {/* Only show custom topic input if "Other" is chosen */}
      {newPostData.topicId === "other" && (
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
        value={newPostData.body}
        onChange={handleChange}
        fullWidth
        placeholder="Enter the content of the post"
        multiline
        minRows={4}
        sx={{ "& textarea": { resize: "vertical" } }}
      />

      {/* Submit Button */}
      <Button
        sx={{ mt: 2 }}
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={18} /> : <FavoriteIcon />}
      >
        {loading ? "Submitting..." : "Submit"}
      </Button>

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
  );
}
