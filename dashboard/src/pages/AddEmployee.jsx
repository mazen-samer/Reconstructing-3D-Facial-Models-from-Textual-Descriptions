import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import Navbar from "../components/Navbar";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function AddEmployee() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});
  const [file, setFile] = useState(null);

  const showToastError = (message) => {
    toast.error(message);
  };
  const showToastSuccess = (message) => {
    toast.success(message);
  };
  const handleFileInput = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    if (!file) {
      showToastError("Please upload a picture of the employee!");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("ssn", data.ssn);
      formData.append("dob", data.dob);
      formData.append("file", file);
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const request = await fetch("http://127.0.0.1:5000/api/addemployee", {
        method: "POST",
        body: formData,
      });

      const response = await request.json();
      if (request.status === 200) {
        showToastSuccess(response.message);
        setIsLoading(false);
        reset();
      } else {
        console.error(response.message);
        if (response.error) console.error(response.error);
        showToastError(response.message);
        setIsLoading(false);
        setFile(null);
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
            <Box>
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <VisuallyHiddenInput type="file" onChange={handleFileInput} />
              </Button>
              <br />
              {file ? <span>{file.name}</span> : null}
            </Box>
            <LoadingButton
              sx={{ width: 180 }}
              type="submit"
              variant="outlined"
              loading={isLoading}
              loadingPosition="end"
              endIcon={<></>}
            >
              Add Employee
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
