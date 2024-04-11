import React from "react";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";

export default function AddCase() {
  return (
    <Box>
      <Navbar
        header="Add a Case"
        subheader="Where you can add a case to begin investigation."
      />
    </Box>
  );
}
