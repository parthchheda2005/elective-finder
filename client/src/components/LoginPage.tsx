import { useState } from "react";
import { Button, TextField, Typography, Alert } from "@mui/material";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const muiTextFieldSx = {
    "& .MuiOutlinedInput-root": {
      color: "white", // Text color
      "& fieldset": {
        borderColor: "white", // Default border color
      },
      "&:hover fieldset": {
        borderColor: "white", // Hover border color
      },
      "&.Mui-focused fieldset": {
        borderColor: "white", // Focus border color
      },
    },
    "& .MuiInputLabel-root": {
      color: "white", // Label color
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "white", // Focused label color
    },
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // make everything its default
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // send request to backend for the token
      const response = await fetch(
        `http://127.0.0.1:8000/login?username=${username}&password=${password}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // error handling
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Failed to login. Please try again."
        );
      }

      // get token
      const data = await response.json();
      const { access_token } = data;

      // put token in local storage
      localStorage.setItem("token", access_token);
      setSuccess("Login successful! Redirecting...");
      console.log("Token:", access_token);
    } catch (e) {
      setError("Can't log you in. Check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center text-slate-200 flex-col sm:flex-row h-screen">
      <div>
        <h1 className="font-bold text-6xl mb-8 sm:mb-4 sm:mr-20">login.</h1>
        <p className="hidden sm:block">
          {" "}
          you know the drill <br /> username, password, all that
        </p>
      </div>

      <div className="sm:flex sm:justify-center sm:items-center sm:flex-col">
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 w-80 items-center"
        >
          <TextField // login text field
            label="Username"
            variant="outlined"
            sx={muiTextFieldSx}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            sx={muiTextFieldSx}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <Button
            type="submit"
            variant="contained"
            style={{ minWidth: "150px", maxWidth: "150px", marginTop: "10px" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
