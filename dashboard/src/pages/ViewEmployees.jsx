import React from "react";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";

export default function ViewEmployees() {
  return (
    <Box>
      <Navbar
        header="View Employees"
        subheader="View all Employees and assign their cases."
      />
    </Box>
  );
}
