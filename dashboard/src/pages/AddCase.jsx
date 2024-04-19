import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import Navbar from "../components/Navbar";
import { useForm } from "react-hook-form";

export default function AddCase() {
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
      const request = await fetch("http://127.0.0.1:5000/api/addcase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const response = await request.json();
      setMessage(response.message);
      if (response.error) {
        console.error(response.error);
      }
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
        header="Add Case"
        subheader="Where you add a case to begin its investigation."
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
              label="Case Title"
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
                required: "Please enter a date",
              })}
            />
            {errors.date?.message && (
              <p style={{ color: "red" }}>{errors.date?.message}</p>
            )}
            <Button type="submit" variant="outlined">
              Add Case
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
