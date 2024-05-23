import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Navbar from "../components/Navbar";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddEmployee() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});

  const showToastError = (message) => {
    toast.error(message);
  };
  const showToastSuccess = (message) => {
    toast.success(message);
  };

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
      if (request.status === 200) {
        showToastSuccess(response.message);
        setIsLoading(false);
        reset();
      } else {
        console.error(response.error);
        showToastError(response.message);
        setIsLoading(false);
        reset();
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      showToastError("There was an error talking to our server");
      reset();
    }
  };
  return (
    <Box>
      <Navbar
        header="Add Employee"
        subheader="Where you add an employee to the system."
      />
      <ToastContainer position="top-right" />
      <Box margin="20px">
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
            <LoadingButton
              sx={{ width: 180 }}
              type="submit"
              variant="outlined"
              loading={isLoading}
              loadingPosition="end"
            >
              Add Employee
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
