import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import SearchBar from './components/SearchBar';
import JobTable from './components/JobTable';
import { Job, getJobs, semanticSearch } from './api/jobApi';

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isSemanticEnabled, setIsSemanticEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      const fetchedJobs = await getJobs();
      setJobs(fetchedJobs);
      setFilteredJobs(fetchedJobs);
    };
    fetchJobs();
  }, []);

  const handleSearch = async (searchTerm: string) => {
    setIsLoading(true);
    let results: Job[] | undefined = [];
    if (isSemanticEnabled) {
      const data  = await semanticSearch(searchTerm);
      results = data?.results || [];
    } else {
      results = jobs.filter(
        (job) =>
          job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredJobs(results);
    setIsLoading(false);
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
        <JobTable jobs={filteredJobs} isLoading={isLoading} />
      </Box>
    </Container>
  );
}

