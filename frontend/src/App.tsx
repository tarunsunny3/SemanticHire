import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import SearchBar from './components/SearchBar';
import JobTable from './components/JobTable';
import { Job, getJobs, semanticSearch } from './api/jobApi';

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isSemanticEnabled, setIsSemanticEnabled] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      const fetchedJobs = await getJobs();
      setJobs(fetchedJobs);
      setFilteredJobs(fetchedJobs);
    };
    fetchJobs();
  }, []);

  const handleSearch = async (searchTerm: string) => {
    if (isSemanticEnabled) {
      const semanticResults = await semanticSearch(searchTerm, jobs);
      setFilteredJobs(semanticResults);
    } else {
      const filtered = jobs.filter(
        (job) =>
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  };

  const handleSemanticToggle = (isEnabled: boolean) => {
    setIsSemanticEnabled(isEnabled);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Job Search
        </Typography>
        <SearchBar onSearch={handleSearch} onSemanticToggle={handleSemanticToggle} />
        <JobTable jobs={filteredJobs} />
      </Box>
    </Container>
  );
}

