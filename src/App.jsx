import React from "react";
import { Route, Routes } from "react-router-dom";
import { Register } from "./components/auth/Register.jsx";
import { Login } from "./components/auth/Login.jsx";
import { Authorized } from "./views/Authorized.jsx";
import { ApplicationViews } from "./views/ApplicationViews.jsx";
import { CurrentUserProvider } from "./context/CurrentUserProvider.jsx";

function App() {
  return (
    <CurrentUserProvider>
      <Routes>
        {/* <Container maxWidth="sm">
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h4" gutterBottom>
              Welcome to My Learning App
            </Typography>
            <Button variant="contained" color="primary">
              Get Started
            </Button>
          </Box>
        </Container> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="*"
          element={
            <Authorized>
              <ApplicationViews />
            </Authorized>
          }
        />
      </Routes>
    </CurrentUserProvider>
  );
}

export default App;
