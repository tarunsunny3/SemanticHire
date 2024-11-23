import React, { useState } from "react";
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
} from "@mui/material";
import { Job } from "../api/jobApi";

interface JobTableProps {
  jobs: Job[];
}

export default function JobTable({ jobs }: JobTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="job listings table">
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Short Description</TableCell>
              <TableCell align="right">Apply</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((job, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={job.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.shortDescription}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      href={job.jobLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Apply
                    </Button>
                  </TableCell>
                </TableRow>
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
