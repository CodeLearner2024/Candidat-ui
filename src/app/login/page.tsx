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
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setToken("");

    try {
      const res = await fetch(
        "http://localhost:8001/candidat-manager/api/v1/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // const role = localStorage.getItem("role");
      // if (role === "ADMIN") {
      router.push("/headeradmin");
      console.log("connexion reussie");
      // } else if (role === "USER") {
      //   router.push("/headeruser");
      //   console.log("connexion user reussi");
      // }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.log("connexion echoue");
      } else {
        setError("Unknown error");
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
          Login
        </Typography>

        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ mt: 2, width: "100%" }}
          noValidate
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size="small"
          />

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
            Login
          </Button>
        </Box>

        {error && (
          <Typography
            variant="body2"
            color="error"
            sx={{ mt: 2, textAlign: "center" }}
          >
            {error}
          </Typography>
        )}

        {token && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: "#f5f5f5",
              borderRadius: 1,
              wordBreak: "break-all",
              width: "100%",
            }}
          ></Box>
        )}
      </Paper>
    </Container>
  );
}
