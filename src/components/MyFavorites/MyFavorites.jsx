import styles from "./MyFavorites.module.css";
import { useState, useEffect } from "react";
import { useCurrentUser } from "../../context/CurrentUserContext.js";
import {
  getLikesExpandPostByUserId,
  deleteLike,
} from "../../services/likes.js";
import { Link } from "react-router-dom";

// MUI imports
import { Typography, Box, Grid, Chip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

// Main MyFavorites component
export default function MyFavorites() {
  const { currentUser } = useCurrentUser();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (currentUser) {
      getLikesExpandPostByUserId(currentUser.id)
        .then((data) => setFavorites(data))
        .catch((error) => console.error("Error fetching favorites:", error));
    }
  }, [currentUser]);

  const handleDelete = (likeId) => {
    deleteLike(likeId)
      .then(() => {
        setFavorites((prevFavorites) =>
          prevFavorites.filter((like) => like.id !== likeId)
        );
      })
      .catch((error) => console.error("Error deleting like:", error));
  };

  const hasFavorites = favorites.length > 0;

  return (
    <Box className={styles.container}>
      <Typography variant="h4" gutterBottom>
        My Favorites
      </Typography>

      {hasFavorites ? (
        <>
          {/* Favorite count */}
          <Typography
            variant="subtitle1"
            className={styles.favoriteCount}
            gutterBottom
          >
            You have {favorites.length} favorite{" "}
            {favorites.length === 1 ? "post" : "posts"}.
          </Typography>

          <Grid container spacing={3}>
            {favorites.map((like, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={like.id}>
                <Box
                  className={styles.postCard}
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  {/* Floating heart overlay */}
                  <Box className={styles.heartOverlay}>
                    <FavoriteIcon className={styles.heartIcon} />
                  </Box>

                  <Typography
                    variant="h6"
                    component={Link}
                    to={`/posts/${like.post.id}`}
                    className={styles.postTitle}
                    gutterBottom
                  >
                    {like.post.title}
                  </Typography>

                  <Typography variant="body2" className={styles.postBody}>
                    {like.post.content}
                  </Typography>

                  <Box className={styles.actionRow}>
                    <Chip
                      label="Remove"
                      onClick={() => handleDelete(like.id)}
                      className={styles.removeChip}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        // Empty state
        <Box className={styles.emptyState}>
          <FavoriteIcon className={styles.emptyHeartIcon} />
          <Typography variant="h6" gutterBottom>
            No favorites yet
          </Typography>
          <Typography variant="body2">
            Explore the latest posts and tap the heart icon to save your
            favorites here.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
