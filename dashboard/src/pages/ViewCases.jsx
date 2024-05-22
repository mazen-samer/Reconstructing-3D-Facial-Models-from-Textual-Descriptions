import {
  Box,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { useState } from "react";
import { baseUrl } from "../constants/baseUrl";

export default function ViewCases() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const getAllIncidents = async () => {
      const request = await fetch(`${baseUrl}/api/incidents`);
      if (request.status === 200) {
        const response = await request.json();
        console.log(response.data);
        setIncidents(response.data);
      }
    };
    getAllIncidents();
  }, []);
  return (
    <Box>
      <Navbar
        header="View all Cases"
        subheader="View all cases and their details."
      />
      <Box margin="20px">
        <Typography fontStyle="italic" color="text.secondary">
          Click on "Learn more" to view its details:
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          gap="30px"
          m="30px 0px"
        >
          {incidents.map((incident, index) => (
            <Card sx={{ minWidth: 275 }} key={index}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  #{incident.id}
                </Typography>
                <Typography variant="h5" component="div">
                  {incident.title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {incident.date}
                </Typography>
                <Typography variant="body2" noWrap>
                  {incident.description}
                  <br />
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} to="/" variant="outlined" size="small">
                  Learn More
                </Button>
                <Link></Link>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
