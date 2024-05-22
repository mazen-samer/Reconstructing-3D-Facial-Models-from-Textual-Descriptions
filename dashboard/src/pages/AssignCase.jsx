import {
  Box,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  FormControl,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { baseUrl } from "../constants/baseUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AssignCase() {
  const { id } = useParams();
  const [employee, setEmployee] = useState({});
  const [assignLoading, setAssignLoading] = useState(false);
  const [unAssignLoading, setUnAssignLoading] = useState(false);
  const [availableIncidents, setAvailableIncidents] = useState([]);
  const [availableIncident, setAvailableIncident] = useState("");
  const [assignedIncidents, setAssignedIncidents] = useState([]);
  const [assignedIncident, setAssignedIncident] = useState("");
  const [message, setMessage] = useState("");

  const showToastError = (message) => {
    toast.error(message);
  };
  const showToastSuccess = (message) => {
    toast.success(message);
  };

  const handleChange = (event) => {
    setAvailableIncident(event.target.value);
  };
  const handleAssignedChange = (event) => {
    setAssignedIncident(event.target.value);
  };

  useEffect(() => {
    const getEmployee = async () => {
      try {
        const request = await fetch(`${baseUrl}/api/getemployee/${id}`);
        const response = await request.json();
        if (request.status === 200) {
          setEmployee(response.data);
        } else if (request.status === 404) {
          setMessage(response.message);
        } else {
          setMessage("Unexpected error happened while processing your request");
        }
      } catch (e) {
        console.error(e);
        setMessage("There was an error talking to our server");
      }
    };

    const getAvailableIncidents = async () => {
      try {
        const request = await fetch(`${baseUrl}/api/available_incidents/${id}`);
        const response = await request.json();
        if (request.status === 200) {
          setAvailableIncidents(response.data);
        } else if (request.status === 404) {
          setMessage(response.message);
        } else {
          setMessage("Unexpected error happened while processing your request");
        }
      } catch (e) {
        console.error(e);
        setMessage("There was an error talking to our server");
      }
    };
    const getAssignedIncidents = async () => {
      try {
        const request = await fetch(`${baseUrl}/api/assigned_incidents/${id}`);
        const response = await request.json();
        if (request.status === 200) {
          setAssignedIncidents(response.data);
        } else if (request.status === 404) {
          setMessage(response.message);
        } else {
          setMessage("Unexpected error happened while processing your request");
        }
      } catch (e) {
        console.error(e);
        setMessage("There was an error talking to our server");
      }
    };

    getEmployee();
    getAvailableIncidents();
    getAssignedIncidents();
  }, [id]);

  const handleAssign = async (e) => {
    e.preventDefault();
    setAssignLoading(true);
    try {
      let request = await fetch(`${baseUrl}/api/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: id,
          incident_id: availableIncident,
        }),
      });
      let response = await request.json();
      if (request.status === 200) {
        showToastSuccess(response.message);
        setAssignLoading(false);
        request = await fetch(`${baseUrl}/api/available_incidents/${id}`);
        response = await request.json();
        if (request.status === 200) {
          setAvailableIncidents(response.data);
          request = await fetch(`${baseUrl}/api/assigned_incidents/${id}`);
          response = await request.json();
          if (request.status === 200) {
            setAssignedIncidents(response.data);
          }
        }
      } else {
        setAssignLoading(false);
        showToastError(response.message);
      }
    } catch (e) {
      console.error(e);
      setAssignLoading(false);
      showToastError("There was an error talking to our server");
    }
    setAssignedIncident("");
    setAvailableIncident("");
  };

  const handleUnAssign = async (e) => {
    e.preventDefault();
    setUnAssignLoading(true);
    try {
      let request = await fetch(`${baseUrl}/api/unassign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: id,
          incident_id: assignedIncident,
        }),
      });
      let response = await request.json();
      if (request.status === 200) {
        showToastSuccess(response.message);
        setUnAssignLoading(false);
        request = await fetch(`${baseUrl}/api/assigned_incidents/${id}`);
        response = await request.json();
        if (request.status === 200) {
          setAssignedIncidents(response.data);
          request = await fetch(`${baseUrl}/api/available_incidents/${id}`);
          response = await request.json();
          if (request.status === 200) {
            setAvailableIncidents(response.data);
          }
        }
      } else {
        setUnAssignLoading(false);
        showToastError(response.message);
      }
    } catch (e) {
      console.error(e);
      setUnAssignLoading(false);
      showToastError("There was an error talking to our server");
    }
    setAssignedIncident("");
    setAvailableIncident("");
  };

  return (
    <Box>
      <Navbar
        header={`Assign Case to Employee #${id}`}
        subheader="No need for a subheader :3"
      />
      <ToastContainer position="top-right" />
      <Box margin="20px">
        {message ? (
          <h1>{message}</h1>
        ) : (
          <Box>
            <Typography sx={{ mb: 2 }} variant="h4" fontWeight="bold">
              Employee details:
            </Typography>
            <Typography>
              Employee name:{" "}
              <Typography fontWeight="bold" component="span">
                {employee.name}
              </Typography>
            </Typography>
            <Typography>
              Employee SSN:{" "}
              <Typography fontWeight="bold" component="span">
                {employee.ssn}
              </Typography>
            </Typography>
            <Typography>
              Employee DOB:{" "}
              <Typography fontWeight="bold" component="span">
                {employee.dob}
              </Typography>
            </Typography>
            <Divider sx={{ m: 2 }} />

            <Box m="20px 0px">
              <Typography>Assign a case to this employee:</Typography>
              <Box width={500} display="flex" flexDirection="column">
                <form onSubmit={handleAssign}>
                  <FormControl fullWidth>
                    <InputLabel id="select-label">
                      Available incidents
                    </InputLabel>
                    <Select
                      labelId="available-case"
                      id="available-case"
                      value={availableIncident}
                      label="Case"
                      name="case"
                      onChange={handleChange}
                    >
                      {availableIncidents.map((incident) => (
                        <MenuItem key={incident.id} value={incident.id}>
                          {incident.id} | {incident.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <LoadingButton
                    sx={{ m: 2, width: 200 }}
                    variant="outlined"
                    type="submit"
                    disabled={availableIncident === ""}
                    loading={assignLoading}
                    loadingPosition="end"
                  >
                    Assign case
                  </LoadingButton>
                </form>
              </Box>
            </Box>
            <Divider sx={{ m: 2 }} />

            <Box m="20px 0px">
              <Typography>Unassign a case to this employee:</Typography>
              <Box width={500} display="flex" flexDirection="column">
                <form onSubmit={handleUnAssign}>
                  <FormControl fullWidth>
                    <InputLabel id="select-label">
                      Assigned incidents
                    </InputLabel>
                    <Select
                      labelId="assigned-case"
                      id="assigned-case"
                      value={assignedIncident}
                      label="Case"
                      name="case"
                      onChange={handleAssignedChange}
                    >
                      {assignedIncidents.map((incident) => (
                        <MenuItem key={incident.id} value={incident.id}>
                          {incident.id} | {incident.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <LoadingButton
                    sx={{ m: 2, width: 200 }}
                    variant="outlined"
                    type="submit"
                    disabled={assignedIncident === ""}
                    loading={unAssignLoading}
                    loadingPosition="end"
                  >
                    Unassign case
                  </LoadingButton>
                </form>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
