import {
  Box,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import React from "react";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { useState } from "react";
import { baseUrl } from "../constants/baseUrl";
import { useParams } from "react-router-dom";

export default function ViewCases() {
  const [incident, setIncident] = useState({});
  const [testimonials, setTestimonials] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const getIncident = async () => {
      try {
        const request = await fetch(`${baseUrl}/api/getincident/${id}`);
        const response = await request.json();
        if (request.status === 200) {
          setIncident(response.data);
        }
      } catch (e) {}
    };
    const getAllTestimonials = async () => {
      try {
        const request = await fetch(`${baseUrl}/api/testimonials/${id}`);
        const response = await request.json();
        if (request.status === 200) {
          console.log(response);
          setTestimonials(response.data);
        }
      } catch (e) {}
    };
    getIncident();
    getAllTestimonials();
  }, [id]);
  return (
    <Box>
      <Navbar
        header={`Incident: ${id}`}
        subheader="View all testimonials for this case."
      />
      <Box margin="20px">
        <Box>
          <Box>
            <Typography
              fontWeight="bold"
              variant="subtitle1"
              display={"inline"}
            >
              Title:{" "}
            </Typography>
            {incident.title}
          </Box>
          <Box>
            <Typography
              fontWeight="bold"
              variant="subtitle1"
              display={"inline"}
            >
              Description:{" "}
            </Typography>
            {incident.description}
          </Box>
          <Box>
            <Typography
              fontWeight="bold"
              variant="subtitle1"
              display={"inline"}
            >
              Date of occurence:{" "}
            </Typography>
            {incident.date}
          </Box>
          <Divider sx={{ mb: 3 }} />
          {testimonials.length === 0 ? (
            <Typography>There are no testimonials for this case yet</Typography>
          ) : (
            <Box>
              <Typography variant="subtitle2">List of testimonials:</Typography>
              {testimonials.map((testimonial, index) => (
                <Accordion key={index}>
                  <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <Box>
                      <Typography>Testimonial #{testimonial.id}</Typography>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        {testimonial.criminal
                          ? "Criminal recognized"
                          : "Criminal Unknown"}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box width={300}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Textual description:{" "}
                        </Typography>
                        <Typography color="text.secondary">
                          "{testimonial.testimonial_text}"
                        </Typography>
                      </Box>
                      <Box
                        width={300}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <img
                          width="200"
                          src={`${baseUrl}/static/imgs/employee-${testimonial.employee.id}.png`}
                          alt=""
                        />
                        <Typography sx={{ fontWeight: "bold" }}>
                          Witness
                        </Typography>
                        <Box>
                          <Typography>
                            name: {testimonial.employee.name}
                          </Typography>
                          <Typography>
                            SSN: {testimonial.employee.ssn}
                          </Typography>
                          <Typography>
                            Date of birth: {testimonial.employee.dob}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        width={300}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {testimonial.criminal ? (
                          <>
                            <img
                              width="200"
                              src={`${baseUrl}/static/imgs/employee-${testimonial.criminal.id}.png`}
                              alt=""
                            />
                            <Typography sx={{ fontWeight: "bold" }}>
                              Potential Criminal
                            </Typography>
                            <Box>
                              <Typography>
                                name: {testimonial.criminal.name}
                              </Typography>
                              <Typography>
                                SSN: {testimonial.criminal.ssn}
                              </Typography>
                              <Typography>
                                Date of birth: {testimonial.criminal.dob}
                              </Typography>
                            </Box>
                          </>
                        ) : (
                          <>
                            <img
                              width="200"
                              src={`${baseUrl}/static/generated/generated-${testimonial.employee.id}-${id}.png`}
                              alt=""
                            />
                            <Typography sx={{ fontWeight: "bold" }}>
                              Generated image
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
