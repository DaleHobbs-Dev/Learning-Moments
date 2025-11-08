import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
// import "./Login.css"
import { getUserByEmail } from "../../services/userService";

export const Login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    return getUserByEmail(email).then((foundUsers) => {
      if (foundUsers.length === 1) {
        const user = foundUsers[0];
        localStorage.setItem(
          "learning_user",
          JSON.stringify({
            id: user.id,
          })
        );

        navigate("/");
      } else {
        window.alert("Invalid login");
      }
    });
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper
        elevation={20}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "background.paper",
        }}
      >
        {/* App name */}
        <Typography
          variant="h4"
          gutterBottom
          color="primary.light"
          sx={{ fontWeight: 600 }}
        >
          Learning Moments
        </Typography>

        {/* Subheader */}
        <Typography variant="h6" gutterBottom color="text.secondary">
          Please sign in
        </Typography>

        {/* Login form */}
        <Box
          component="form"
          onSubmit={handleLogin}
          noValidate
          sx={{ mt: 2, width: "100%" }}
        >
          <TextField
            margin="normal"
            fullWidth
            type="email"
            label="Email Address"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
            required
            autoFocus
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Sign In
          </Button>
        </Box>
      </Paper>

      {/* Register link */}
      <Box mt={2} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Not a member yet?{" "}
          <Link
            to="/register"
            style={{ color: "#80cbc4", textDecoration: "none" }}
          >
            Register here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};
