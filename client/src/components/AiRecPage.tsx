import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseRecommendationsDisplay from "./CourseRecommendationsDisplay";

export default function AiRecPage() {
  const [apiRoute, setApiRoute] = useState<string>(""); // Changed to string type
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string>(""); // Added type
  const [error, setError] = useState<string>(""); // Added error state

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    // Form validation
    if (!apiRoute) {
      setError("Please select a recommendation type");
      return;
    }

    setIsLoading(true);
    setApiResponse("");
    setError("");

    try {
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `https://elective-finder.onrender.com/${apiRoute}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Properly await json parsing

      if (!data.Data) {
        throw new Error("Invalid response format");
      }

      setApiResponse(data.Data);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Something went wrong";
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-fit flex justify-center items-center flex-col">
      <button
        onClick={() => navigate("/course-page")}
        className="p-2 bg-indigo-200 text-[#242424] rounded transition-all duration-300 hover:bg-blue-300 hover:scale-105 w-fit mt-2 mb-4"
      >
        go look at courses.
      </button>
      <Box sx={{ width: "100%", maxWidth: 400, px: 2 }}>
        <FormControl fullWidth>
          <InputLabel sx={{ color: "white" }}>
            Pick a recommendation to get
          </InputLabel>
          <Select
            value={apiRoute}
            label="Pick a recommendation to get"
            onChange={(e) => setApiRoute(e.target.value)}
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
            }}
          >
            <MenuItem
              key={"recommended-arts-courses-100-200"}
              value={"recommended-arts-courses-100-200"}
            >
              Recommend Lower Level Arts Courses (100/200 Level)
            </MenuItem>
            <MenuItem
              key={"recommended-arts-courses-300"}
              value={"recommended-arts-courses-300"}
            >
              Recommend Upper Level Arts Courses (300/400 Level)
            </MenuItem>
            <MenuItem
              key={"recommended-science-courses-100-200"}
              value={"recommended-science-courses-100-200"}
            >
              Recommend Lower Level Science Courses (100/200 Level)
            </MenuItem>
            <MenuItem
              key={"recommended-science-courses-300"}
              value={"recommended-science-courses-300"}
            >
              Recommend Upper Level Science Courses (300/400 Level)
            </MenuItem>
            <MenuItem
              key={"recommend-upper-level-courses-outside-major"}
              value={"recommend-upper-level-courses-outside-major"}
            >
              Recommend Upper Level Courses Outside Major (300/400 Level)
            </MenuItem>
            <MenuItem
              key={"recommend-upper-level-courses-in-major"}
              value={"recommend-upper-level-courses-in-major"}
            >
              Recommend Upper Level Courses In Major (300/400 Level)
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      <div className="mt-5">
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Asking Gemini..." : "Get your recommendations"}
        </Button>
      </div>
      {isLoading && (
        <Alert severity="success">
          Query successfully submitted! Waiting on Gemini...
        </Alert>
      )}
      {error && (
        <Alert severity="error" className="mt-4 max-w-[720px] mx-10">
          {error}
        </Alert>
      )}
      {apiResponse && (
        <div
          className={`w-full max-w-[720px] text-neutral-100 bg-neutral-700 mx-10 my-3 shadow-lg rounded-lg px-3 py-3 flex items-center justify-between mt-4 flex-col font-semibold`}
        >
          <CourseRecommendationsDisplay recommendationsText={apiResponse} />
        </div>
      )}
    </div>
  );
}
