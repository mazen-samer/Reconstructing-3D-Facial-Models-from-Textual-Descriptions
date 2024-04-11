import { Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import React from "react";

export default function Sidebar() {
  return (
    <ProSidebar
      rootStyles={{
        [`.ps-sidebar-container`]: {
          backgroundColor: "white",
        },
      }}
    >
      <Box>
        <Box padding="10px">
          <Typography
            variant="h5"
            textAlign="center"
            sx={{ textDecoration: "none" }}
          >
            Admin Dashboard
          </Typography>
          <Typography textAlign="center">
            Reconstructing 3D Facial Models from Textual Descriptions
          </Typography>
        </Box>
        <Menu>
          <MenuItem component={<NavLink to="/" />}>Home</MenuItem>
          <Typography fontSize="18px" fontWeight="bold" padding="5px 20px">
            Cases
          </Typography>
          <MenuItem component={<NavLink to="/addcase" />}>Add a case</MenuItem>
          <Typography fontSize="18px" fontWeight="bold" padding="5px 20px">
            Employees' Affairs
          </Typography>
          <MenuItem component={<NavLink to="/viewall" />}>
            View Employees
          </MenuItem>
        </Menu>
      </Box>
    </ProSidebar>
  );
}
