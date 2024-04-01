import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import React from "react";

export default function Sidebar() {
  return (
    <ProSidebar>
      <Box>logo/project name here</Box>
      <Menu>
        <SubMenu label="Charts" open>
          <MenuItem> Pie charts </MenuItem>
          <MenuItem> Line charts </MenuItem>
          <MenuItem> Documentation </MenuItem>
          <MenuItem> Calendar </MenuItem>
        </SubMenu>
        <MenuItem component={<Link to="/" />}>Documentation</MenuItem>
      </Menu>
    </ProSidebar>
  );
}
