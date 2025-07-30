"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Paper,
  Alert, // For displaying success/error messages
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";
import Link from "next/link"; // For the "Already have an account?" link

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // State for success messages
  const router = useRouter();

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    try {
      const res = await fetch(
        "http://localhost:8001/candidat-manager/api/v1/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName, username, password }), // Send all fields
        }
      );

      if (!res.ok) {
        // If the response is not OK (e.g., 400, 409, 500)
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Registration failed. Please try again."
        );
      }

      // If registration is successful
      setSuccess("Registration successful! Redirecting to login...");
      // Optionally, you might want to automatically log them in or redirect to login
      setTimeout(() => {
        router.push("/login"); // Redirect to the login page
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Registration failed:", err.message);
      } else {
        setError("An unknown error occurred during registration.");
        console.error("An unknown error occurred:", err);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "background.paper",
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Register
        </Typography>

        <Box
          component="form"
          onSubmit={handleRegister}
          sx={{ mt: 2, width: "100%" }}
          noValidate
        >
          {/* Full Name Field */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Full Name"
            variant="outlined"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            size="small"
          />

          {/* Username Field */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username (Email Address)" // Often username is an email
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size="small"
          />

          {/* Password Field */}
          <TextField
            margin="normal"
            size="small"
            required
            fullWidth
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, py: 1.5 }}
            size="small"
          >
            Register
          </Button>
        </Box>

        {/* Display Error Message */}
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            {error}
          </Alert>
        )}

        {/* Display Success Message */}
        {success && (
          <Alert severity="success" sx={{ mt: 2, width: "100%" }}>
            {success}
          </Alert>
        )}

        {/* Link to Login Page */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link href="/login" passHref legacyBehavior>
              <Button
                component="a"
                variant="text"
                sx={{ textTransform: "none", p: 0, minWidth: 0 }}
              >
                Login here
              </Button>
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
