import { Box, Typography } from "@mui/material";
import React from "react";

export default function Navbar({ header, subheader }) {
  return (
    <Box padding="10px 30px" borderBottom="1px solid black">
      <Typography fontWeight="bold" variant="h5">
        {header}
      </Typography>
      <Typography variant="h7">{subheader}</Typography>
    </Box>
  );
}
