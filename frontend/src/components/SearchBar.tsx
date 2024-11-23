import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  Button,
  Box,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  onSemanticToggle: (isEnabled: boolean) => void;
}

export default function SearchBar({
  onSearch,
  onSemanticToggle,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [semanticButtonText, setSemanticButtonText] = useState(
    "Use Semantic Search?"
  );
  const [isSemanticEnabled, setIsSemanticEnabled] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm);
  };

  const handleSemanticToggle = () => {
    const newState = !isSemanticEnabled;
    setIsSemanticEnabled(newState);
    onSemanticToggle(newState);
    setSemanticButtonText("Use Text Search?");
  };

  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for jobs..."
        value={searchTerm}
        onChange={handleChange}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant={isSemanticEnabled ? "contained" : "outlined"}
          color="primary"
          onClick={handleSemanticToggle}
        >
          {semanticButtonText}
        </Button>
        {isSemanticEnabled ? (
          <Typography variant="body2" color="text.secondary">
            Semantic search enabled, results may be more relevant but might take
            longer, click on the button to switch to Textual Search
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Textual search enabled, results will be fast and may be less
            relevant to your query, click the button to enable Semantic Search
          </Typography>
        )}
      </Box>
    </Box>
  );
}
