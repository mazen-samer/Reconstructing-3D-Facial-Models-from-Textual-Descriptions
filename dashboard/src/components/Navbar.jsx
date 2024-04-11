import { Box, Typography } from "@mui/material";
import React from "react";

export default function Navbar({ header, subheader }) {
  return (
    <Box padding="10px 30px">
      <Typography variant="h5">{header}</Typography>
      <Typography variant="h6">{subheader}</Typography>
    </Box>
  );
}
