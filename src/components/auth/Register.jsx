import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { createUser, getUserByEmail } from "../../services/userService";

export const Register = (props) => {
  const [user, setUser] = useState({
    email: "",
    name: "",
    cohort: 0,
  });
  let navigate = useNavigate();

  const registerNewUser = () => {
    const newUser = {
      ...user,
      cohort: parseInt(user.cohort),
    };

    createUser(newUser).then((createdUser) => {
      if (createdUser.hasOwnProperty("id")) {
        localStorage.setItem(
          "learning_user",
          JSON.stringify({
            id: createdUser.id,
            staff: createdUser.isStaff,
          })
        );

        navigate("/");
      }
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    getUserByEmail(user.email).then((response) => {
      if (response.length > 0) {
        // Duplicate email. No good.
        window.alert("Account with that email address already exists");
      } else {
        // Good email, create user.
        registerNewUser();
      }
    });
  };

  const updateUser = (evt) => {
    const copy = { ...user };
    copy[evt.target.id] = evt.target.value;
    setUser(copy);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "background.paper",
        }}
      >
        {/* App title */}
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
          Please Register
        </Typography>

        {/* Registration form */}
        <Box
          component="form"
          onSubmit={handleRegister}
          noValidate
          sx={{ mt: 2, width: "100%" }}
        >
          <TextField
            id="name"
            label="Full Name"
            variant="outlined"
            margin="normal"
            fullWidth
            value={user.name}
            onChange={updateUser}
            required
            autoFocus
          />

          <TextField
            id="email"
            label="Email Address"
            type="email"
            variant="outlined"
            margin="normal"
            fullWidth
            value={user.email}
            onChange={updateUser}
            required
          />

          <TextField
            id="cohort"
            label="Cohort Number"
            type="number"
            variant="outlined"
            margin="normal"
            fullWidth
            value={user.cohort}
            onChange={updateUser}
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Register
          </Button>
        </Box>
      </Paper>

      {/* Back to login link */}
      <Box mt={2} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Already a member?{" "}
          <Link
            to="/login"
            style={{ color: "#80cbc4", textDecoration: "none" }}
          >
            Sign in
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};
