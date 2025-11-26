import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  TextField,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../context/CurrentUserContext.js";
import { getUserById, updateUser } from "../../services/userService.js";
import styles from "./EditProfile.module.css";

export const EditProfile = () => {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cohort: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.id) {
        navigate("/profile");
        return;
      }

      try {
        const userData = await getUserById(currentUser.id.toString());
        setFormData({
          name: userData.name || "",
          cohort: userData.cohort || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedUser = await updateUser(currentUser.id, formData);

      // Update the current user in context
      setCurrentUser(updatedUser);

      // Update localStorage
      localStorage.setItem("learning_user", JSON.stringify(updatedUser));

      // Navigate back to profile
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Paper className={styles.editCard} elevation={4}>
        <Typography variant="h4" className={styles.heading} gutterBottom>
          Edit Profile
        </Typography>

        <Box component="form" className={styles.form}>
          {/* Name Field */}
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            required
            variant="outlined"
            className={styles.inputField}
          />

          {/* Cohort Field */}
          <TextField
            label="Cohort"
            name="cohort"
            value={formData.cohort}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            className={styles.inputField}
          />

          {/* Action Buttons */}
          <Box className={styles.buttonRow}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving}
              className={styles.saveBtn}
            >
              {saving ? "Saving..." : "Save"}
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              disabled={saving}
              className={styles.cancelBtn}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
