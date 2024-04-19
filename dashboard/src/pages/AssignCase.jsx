import { Box } from "@mui/material";
import React from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";

export default function AssignCase() {
  const { id } = useParams();
  return (
    <Box>
      <Navbar
        header={`Assign Case to Employee #${id}`}
        subheader="No need for a subheader :3"
      />
      <Box margin="20px"></Box>
    </Box>
  );
}
