import React, { useState } from "react";
import { CircularProgress } from "@mui/material";

import {
  Box,
  Divider,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import { List, ListItemText } from "@mui/material";
import Navbar from "../components/Navbar";
import { baseUrl } from "../constants/baseUrl";
import { Link } from "react-router-dom";

export default function ViewEmployees() {
  const [helperText, setHelperText] = useState("");
  const [errorBool, setErrorBoll] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [serverErr, setServerErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const handleOnChange = (e) => {
    const ssn = e.target.value;
    if (ssn === undefined || ssn.match(/^\d+$/) === null) {
      // Invalid input: Contains non-digit characters or input is empty
      setHelperText("Please enter a number!");
      setErrorBoll(true);
    } else {
      setErrorBoll(false);
      setHelperText("");
      const getEmployees = async () => {
        setIsLoading(true);
        try {
          const request = await fetch(`${baseUrl}/api/findemployee/${ssn}`, {
            method: "GET",
          });
          const response = await request.json();
          setEmployees(response.data);
          if (response.data.length === 0) {
            setIsEmpty(true);
          } else {
            setIsEmpty(false);
          }
          setIsLoading(false);
          setServerErr(false);
        } catch (e) {
          console.error(e);
          setIsLoading(false);
          setServerErr(true);
          setEmployees([]);
        }
      };
      getEmployees();
    }
  };

  return (
    <Box>
      <Navbar
        header="View Employees"
        subheader="View all Employees and assign their cases."
      />
      <Box margin="20px">
        <Box>
          <Typography>
            Please enter the SSN for the employee you want to find:
          </Typography>
          <TextField
            error={errorBool}
            id="standard-basic"
            label="Employee SSN"
            variant="standard"
            sx={{
              width: 500,
              marginTop: "10px",
              height: 50,
            }}
            onChange={handleOnChange}
            helperText={helperText}
          />
        </Box>
        <Box padding="20px" marginTop="20px">
          {isLoading && <CircularProgress />}
          {!isLoading && serverErr && (
            <p>There was an error talking to our server</p>
          )}

          {isEmpty ? (
            <p>There is no employee with this SSN.</p>
          ) : (
            <List>
              {employees.map((employee, index) => (
                <React.Fragment key={index}>
                  <ListItemButton
                    component={Link}
                    to={`/assign/${employee.id}`}
                    alignItems="center"
                    sx={{ justifyContent: "space-between" }}
                  >
                    <ListItemText primary={`SSN: ${employee.ssn}`} />
                    <ListItemText
                      primary={`${
                        employee.name.charAt(0).toUpperCase() +
                        employee.name.slice(1)
                      }`}
                      secondary={
                        <React.Fragment>{employee.dob}</React.Fragment>
                      }
                    />
                    <Typography color="text.secondary">
                      Click to assign an incident
                    </Typography>
                  </ListItemButton>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Box>
  );
}
