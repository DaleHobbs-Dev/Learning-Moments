import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@mui/material";
import styles from "../NavigationBar/NavigationBar.module.css";

export default function AuthButton() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("learning_user"));

  const handleLogout = () => {
    localStorage.removeItem("learning_user");
    navigate("/login", { replace: true });
  };

  return (
    <>
      {isLoggedIn ? (
        <Button
          color="inherit"
          className={styles.navItem}
          onClick={handleLogout}
        >
          Logout
        </Button>
      ) : (
        <Button
          color="inherit"
          className={styles.navItem}
          component={Link}
          to="/login"
        >
          Login
        </Button>
      )}
    </>
  );
}
