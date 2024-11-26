import React, { useState } from 'react';
import { 
  TextField, 
  InputAdornment, 
  Button, 
  Box, 
  Typography, 
  Checkbox,
  FormControlLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  onSearch: (searchTerm: string, isSemantic: boolean) => void;
  onSemanticToggle: (isEnabled: boolean) => void;
}

export default function SearchBar({ onSearch, onSemanticToggle }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSemanticEnabled, setIsSemanticEnabled] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(searchTerm, isSemanticEnabled);
  };

  const handleSemanticToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSemanticEnabled(event.target.checked);
    onSemanticToggle(event.target.checked);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              checked={isSemanticEnabled}
              onChange={handleSemanticToggle}
              name="semanticSearch"
              color="primary"
            />
          }
          label="Use Semantic Search"
        />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {isSemanticEnabled
          ? "Semantic search enabled: Results may be more relevant but might take longer. Uncheck to use textual search."
          : "Textual search enabled: Results will be fast but may be less relevant. Check the box to enable semantic search."}
      </Typography>
    </Box>
  );
}

