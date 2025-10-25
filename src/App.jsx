import React from "react";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import { Container, Typography, Button, Box } from "@mui/material";
import { AllPosts } from "./components/AllPostsView/AllPosts.jsx";

function App() {
  return (
    <>
      {/* <NavigationBar />
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to My Learning App
          </Typography>
          <Button variant="contained" color="primary">
            Get Started
          </Button>
        </Box>
      </Container> */}
      <AllPosts />
    </>
  );
}

export default App;
