import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

// Component to filter posts by topic accepting props of topics, selectedTopic, and onTopicChange
function FilterPostsByTopic({ topics = [], selectedTopic, onTopicChange }) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel id="topic-filter-label" shrink>
        Filter by Topic
      </InputLabel>
      <Select
        labelId="topic-filter-label"
        value={selectedTopic}
        label="Filter by Topic"
        onChange={(e) => onTopicChange(e.target.value)}
        displayEmpty
      >
        {/* Default placeholder option */}
        <MenuItem value="" disabled>
          <em>Choose a Topic</em>
        </MenuItem>

        {/* Optional “All Topics” option */}
        <MenuItem value="all">All Topics</MenuItem>

        {/* Dynamic topic options */}
        {topics.map((topic) => (
          <MenuItem key={topic.id} value={topic.name.toLowerCase()}>
            {topic.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default FilterPostsByTopic;
