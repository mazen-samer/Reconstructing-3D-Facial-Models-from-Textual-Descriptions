import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Navbar from "../components/Navbar";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddCase() {
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
      const request = await fetch("http://127.0.0.1:5000/api/addcase", {
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
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      showToastError("Something went wrong with the server");
    }
  };

  return (
    <Box>
      <Navbar
        header="Add Case"
        subheader="Where you add a case to begin its investigation."
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
              error={errors.title?.message ? true : false}
              id="standard-basic"
              label="Case Title"
              variant="standard"
              sx={{
                height: 50,
              }}
              {...register("title", {
                required: "Please enter a title!",
              })}
              helperText={errors.title?.message}
            />
            <TextField
              error={errors.description?.message ? true : false}
              id="outlined-multiline-static"
              label="Case Description"
              multiline
              rows={4}
              sx={{
                width: 500,
              }}
              {...register("description", {
                required: "Please enter a description!",
              })}
              helperText={errors.description?.message}
            />
            <input
              style={{ fontSize: 20 }}
              type="date"
              {...register("date", {
                required: "Please enter a date!",
              })}
            />
            {errors.date?.message && (
              <p style={{ color: "red" }}>{errors.date?.message}</p>
            )}
            <LoadingButton
              sx={{ width: 150 }}
              type="submit"
              variant="outlined"
              loading={isLoading}
              loadingPosition="end"
            >
              Add Case
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
