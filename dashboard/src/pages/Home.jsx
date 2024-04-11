import React from "react";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <Box>
      <Navbar header="Home Page" subheader="Company's statistical numbers." />
    </Box>
  );
}
