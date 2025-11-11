import { useState, useEffect } from "react";
import { useCurrentUser } from "../../context/CurrentUserContext.js";
//import styles from "./NewPost.module.css";
import { getAllTopics, createTopic } from "../../services/topics.js";

// MUI imports
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Stack,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function NewPost() {
  const currentUser = useCurrentUser();

  const [topics, setTopics] = useState([]);

  useEffect(() => {
    getAllTopics()
      .then((data) => setTopics(data))
      .catch((error) => console.error("Error fetching topics:", error));
  }, []);

  const handleCreateTopic = (newTopic, topicDescription) => {
    setTopics((prevTopics) => [...prevTopics, newTopic]);

    const newTopicObject = {
      name: newTopic,
      description: topicDescription,
    };

    createTopic(newTopicObject).catch((error) =>
      console.error("Error creating topic:", error)
    );
  };

  return (
    <Card>
      <Typography variant="h4">Create a New Post</Typography>
      <Typography>
        Select a topic from the dropdown menu and write your post below.
      </Typography>
    </Card>
  );
}
