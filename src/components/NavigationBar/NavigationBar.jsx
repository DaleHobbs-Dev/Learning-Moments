import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./NavigationBar.module.css";
import AuthButton from "../auth/AuthButton";

export default function NavigationBar() {
  return (
    <AppBar position="static" color="primary" className={styles.navbar}>
      <Toolbar className={styles.toolbar}>
        {/* Left side — app name or logo */}
        {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Learning Moments
        </Typography> */}

        {/* navigation links */}
        <Box component="nav" className={styles.navLinks}>
          <Button
            color="inherit"
            className={styles.navItem}
            component={Link}
            to="/"
          >
            All Posts
          </Button>
          <Button
            color="inherit"
            className={styles.navItem}
            component={Link}
            to="/my-posts"
          >
            My Posts
          </Button>
          <Button color="inherit" className={styles.navItem}>
            Favorites
          </Button>
          <Button
            color="inherit"
            className={styles.navItem}
            component={Link}
            to="/new-post"
          >
            New Post
          </Button>
          <Button color="inherit" className={styles.navItem}>
            Profile
          </Button>
        </Box>
        {/* right-aligned logout/login */}
        <Box sx={{ flexGrow: 1 }} />
        <AuthButton />
      </Toolbar>
    </AppBar>
  );
}
