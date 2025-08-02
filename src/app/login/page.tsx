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
import Link from "next/link";

// Fonction pour décoder la payload JWT et extraire le rôle
function getRoleFromToken(token: string): string | null {
  try {
    const payloadBase64 = token.split(".")[1];
    // Convertir base64url en base64 standard
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    // Décoder en string JSON
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    // Adapter la clé selon la structure de ton token (exemple : "role", "roles", "authorities"...)
    return payload.role || null;
  } catch (error) {
    console.error("Erreur lors du décodage du token :", error);
    return null;
  }
}

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

      // Extraire le rôle depuis le token JWT
      const role = getRoleFromToken(data.token);
      if (role) {
        localStorage.setItem("role", role);
        console.log("role est :", role);
      } else {
        console.warn("Role non trouvé dans le token");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.log("Connexion échouée");
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
          >
            Token reçu : {token}
          </Box>
        )}

        {/* --- */}
        {/* New section for registration prompt */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link href="/register">
              <Button
                component="a"
                variant="text"
                sx={{ textTransform: "none", p: 0, minWidth: 0 }}
              >
                Register here
              </Button>
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
