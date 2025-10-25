import React from "react";
import { useState, useEffect } from "react";
import { getPostsWithTopics } from "../../services/posts.js";
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

function AllPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPostsWithTopics().then(setPosts);
  }, []);

  return (
    <Box className={styles.container}>
      <Typography variant="h4" gutterBottom align="center">
        All Posts
      </Typography>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card className={styles.card}>
              <CardContent>
                {/* Post Title */}
                <Typography
                  variant="h6"
                  component="div"
                  className={styles.title}
                  gutterBottom
                >
                  {post.title}
                </Typography>

                {/* Topic Tag */}
                <Chip
                  label={post.topic?.name || "Untitled Topic"}
                  color="primary"
                  size="small"
                  className={styles.topicChip}
                />

                {/* Likes Count */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  className={styles.likesRow}
                  sx={{ mt: 2 }}
                >
                  <FavoriteIcon color="error" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {post.likesCount ?? 0}{" "}
                    {post.likesCount === 1 ? "Like" : "Likes"}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export { AllPosts };
