import styles from "./AllPosts.module.css";
// MUI imports
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import React from "react";
import { useState, useEffect } from "react";
import { getPostsWithTopics } from "../../services/posts.js";
import { useParams } from "react-router-dom";

export function PostDetails() {
  const { postId } = useParams();
  const [post, setPost] = useState({});

  useEffect(() => {
    getPostsWithTopics().then((data) => {
      const foundPost = data.find((p) => p.id === postId);
      setPost(foundPost);
    });
  }, [postId]);

  if (!post) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Card className={styles.postDetailsCard}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body1">{post.content}</Typography>
        {post.topic && (
          <Chip label={post.topic.name} color="primary" variant="outlined" />
        )}
        <Box mt={2} display="flex" alignItems="center">
          <FavoriteIcon color="error" />
          <Typography variant="body2" ml={1}>
            {post.likes} Likes
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
