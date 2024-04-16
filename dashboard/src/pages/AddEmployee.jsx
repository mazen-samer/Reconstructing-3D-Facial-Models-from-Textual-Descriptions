import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import Navbar from "../components/Navbar";
import { useForm } from "react-hook-form";

export default function AddEmployee() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const request = await fetch("http://127.0.0.1:5000/api/addemployee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const response = await request.json();
      setMessage(response.message);
      setIsLoading(false);
      reset();
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      setMessage("Something went wrong with the server");
    }
  };
  return (
    <Box>
      <Navbar
        header="Add Employee"
        subheader="Where you add an employee to the system."
      />
      <Box margin="20px">
        {message !== "" && <p style={{ color: "red" }}>{message}</p>}
        {isLoading && <p>Loading...</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            display="flex"
            flexDirection="column"
            gap="30px"
            alignItems="flex-start"
          >
            <TextField
              error={errors.name?.message ? true : false}
              id="standard-basic"
              label="Employee Name"
              variant="standard"
              sx={{
                height: 50,
              }}
              {...register("name", {
                required: "Please enter a name!",
              })}
              helperText={errors.name?.message}
            />
            <TextField
              error={errors.ssn?.message ? true : false}
              id="standard-basic"
              label="Employee SSN"
              variant="standard"
              sx={{
                height: 50,
              }}
              {...register("ssn", {
                required: "Please enter a valid ssn!",
              })}
              helperText={errors.ssn?.message}
            />
            <input
              style={{ fontSize: 20 }}
              type="date"
              {...register("dob", {
                required: "Please enter a date",
              })}
            />
            {errors.dob?.message && (
              <p style={{ color: "red" }}>{errors.dob?.message}</p>
            )}
            <Button type="submit" variant="outlined">
              Add Employee
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
