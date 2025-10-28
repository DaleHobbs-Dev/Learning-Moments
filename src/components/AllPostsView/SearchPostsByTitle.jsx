import React from "react";
import { TextField } from "@mui/material";

function SearchPostsByTitle({ searchTerm, onSearchTermChange }) {
  return (
    <TextField
      label="Search Posts by Title"
      variant="outlined"
      fullWidth
      size="small"
      value={searchTerm}
      onChange={(e) => onSearchTermChange(e.target.value)}
    />
  );
}

export default SearchPostsByTitle;
