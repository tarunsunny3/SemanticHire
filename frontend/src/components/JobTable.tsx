import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  Box,
  Typography,
  CircularProgress,
  Modal,
  IconButton,
} from '@mui/material';
import { Job } from '../api/jobApi';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface JobTableProps {
  jobs: Job[];
  isLoading: boolean;
}

const JobModal = ({ job, open, onClose }: { job: Job; open: boolean; onClose: () => void }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="job-modal-title"
      aria-describedby="job-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        maxHeight: '80vh',
        overflowY: 'auto',
      }}>
        <Typography id="job-modal-title" variant="h3" component="h2">
          {job.company_name}
        </Typography>
        <Typography id="job-modal-subtitle" sx={{ mt: 2 }}>
          {job.title}
        </Typography>
        <Typography id="job-modal-description" sx={{ mt: 2 }}>
          {job.description}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href={job.job_link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mt: 2 }}
        >
          Apply
        </Button>
      </Box>
    </Modal>
  );
};

function Row({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {job.company_name}
        </TableCell>
        <TableCell>{job.title}</TableCell>
        {/* <TableCell>{job.career_level}</TableCell> */}
        <TableCell>
          <Button
            variant="contained"
            color="primary"
            href={job.job_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply
          </Button>
        </TableCell>
      </TableRow>
      <JobModal job={job} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default function JobTable({ jobs, isLoading }: JobTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Company Name</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Apply</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((job) => (
                <Row key={job.id} job={job} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={jobs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

