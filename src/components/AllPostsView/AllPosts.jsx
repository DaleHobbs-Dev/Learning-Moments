// View all posts with filtering and searching capabilities
import React from "react";
import { useState, useEffect } from "react";
import { getPostsWithTopics } from "../../services/posts.js";

// import without braces since it's a default export
import FilterPostsByTopic from "./FilterPostsByTopic.jsx";
import SearchPostsByTitle from "./SearchPostsByTitle.jsx";
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

// Main AllPosts component
function AllPosts() {
  // State management
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch posts
  useEffect(() => {
    // Fetch posts with extended topics on component mount
    getPostsWithTopics().then((data) => {
      setPosts(data);
      setFilteredPosts(data);
      // Extract unique topics
      const uniqueTopics = Array.from(
        // Map to ensure uniqueness
        new Map(
          data
            // Filter out posts without topics
            .filter((p) => p.topic)
            // Transform each post to [topicId, topicObject] pairs
            .map((p) => [p.topic.id, { id: p.topic.id, name: p.topic.name }])
          // Values iterator to get unique topic objects
        ).values()
      );
      setTopics(uniqueTopics);
    });
  }, []);

  // Filter posts whenever searchTerm or selectedTopic changes
  useEffect(() => {
    let updated = posts;

    if (selectedTopic && selectedTopic !== "all") {
      updated = updated.filter(
        (post) => post.topic?.name.toLowerCase() === selectedTopic
      );
    }

    if (searchTerm) {
      updated = updated.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(updated);
  }, [searchTerm, selectedTopic, posts]);

  return (
    <Box className={styles.container}>
      <Typography variant="h4" gutterBottom align="center">
        All Posts
      </Typography>

      <Grid
        container
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ mb: 3 }}
      >
        <Grid item xs={12} sm={6}>
          {/* Topic filter dropdown */}
          <FilterPostsByTopic
            topics={topics}
            selectedTopic={selectedTopic}
            onTopicChange={setSelectedTopic}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {/* Search bar */}
          <SearchPostsByTitle
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />
        </Grid>
      </Grid>

      {/* Posts grid */}
      <Grid container spacing={3}>
        {filteredPosts.map((post) => (
          // Transform each post into a card
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card className={styles.card}>
              <CardContent>
                {/* Post title */}
                <Typography
                  variant="h6"
                  component="div"
                  className={styles.title}
                  gutterBottom
                >
                  {post.title}
                </Typography>

                {/* Topic chip */}
                <Chip
                  label={post.topic?.name || "Untitled Topic"}
                  color="primary"
                  size="small"
                  className={styles.topicChip}
                />

                {/* Likes display */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  className={styles.likesRow}
                  sx={{ mt: 2 }}
                >
                  {/* Like icon and count */}
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
