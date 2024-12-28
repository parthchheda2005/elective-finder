import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

export interface Subject {
  subject: string;
  subject_title: string;
}

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
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

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password != passwordAgain) {
      setError("Passwords do not match. Ensure they do");
      return;
    }

    try {
      // send request to backend for the token
      const response = await fetch(`http://127.0.0.1:8000/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          major: subject,
          email,
          username,
          password,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Failed to register. Please try again."
        );
      }

      setSuccess("Registration successful! Redirecting...");
    } catch (e) {
      setError(
        "Can't register. Check your credentials, ensure everything is filled in"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const getSubjects = async () => {
      setSubjects([]);
      try {
        const res = await fetch("https://ubcgrades.com/api/v3/subjects/UBCV", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setSubjects(
          data.filter(
            (el: Subject) => el.subject != "AANB" && el.subject != "AQUA"
          )
        );
        setSubject(data[0].subject);
        console.log(data);
      } catch (e) {
        console.error("Failed to fetch subjects:", e);
      }
    };

    getSubjects();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (subjects.length > 0 && subject === "") {
      setSubject("CPSC");
    }
  }, [subjects]);

  return (
    <div className="flex justify-center items-center text-slate-200 flex-col h-screen">
      <h1 className="font-bold text-6xl mb-8">Register</h1>

      <form
        onSubmit={handleRegistration}
        className="flex flex-col gap-4 w-80 items-center"
      >
        <TextField
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
        <TextField
          label="Re-enter Password"
          type="password"
          variant="outlined"
          sx={muiTextFieldSx}
          value={passwordAgain}
          onChange={(e) => setPasswordAgain(e.target.value)}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          sx={muiTextFieldSx}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <FormControl fullWidth>
          <InputLabel
            id="subject-label"
            sx={{
              color: "white",
              "&.Mui-focused": {
                color: "white",
              },
            }}
          >
            Subject
          </InputLabel>
          <Select
            labelId="subject-label"
            id="subject-select"
            value={subject}
            label="Subject"
            onChange={(e) => {
              setSubject(e.target.value);
              console.log(e.target.value);
            }}
            sx={{
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "& .MuiSvgIcon-root": {
                color: "white",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
            }}
          >
            {subjects.map((el: Subject) => (
              <MenuItem key={el.subject} value={el.subject_title}>
                {`${el.subject} - ${el.subject_title}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Button
          type="submit"
          variant="contained"
          style={{ minWidth: "150px", maxWidth: "150px", marginTop: "10px" }}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
}
