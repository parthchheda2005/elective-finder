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

// Define the structure of parsed recommendations
interface Recommendation {
  number: string;
  course: string;
  description: string;
}

// Parse recommendations from raw text
const parseRecommendations = (text: string): Recommendation[] => {
  // Split the text by numbers at the start of lines
  const parts = text.split(/(?=\d+\.\s+)/);

  return parts
    .filter((part) => part.trim()) // Remove empty parts
    .map((part) => {
      // Extract the number
      const numberMatch = part.match(/^(\d+)\./);
      const number = numberMatch ? numberMatch[1] : "";

      // Remove the number from the remaining text
      const remaining = part.replace(/^\d+\.\s*/, "");

      // Split into course and description
      const colonIndex = remaining.indexOf(":");
      const course =
        colonIndex !== -1 ? remaining.substring(0, colonIndex).trim() : "";
      const description =
        colonIndex !== -1 ? remaining.substring(colonIndex + 1).trim() : "";

      return {
        number,
        course,
        description,
      };
    })
    .filter((rec) => rec.number && rec.course && rec.description); // Only keep complete recommendations
};

export default function AiRecPage() {
  const [apiRoute, setApiRoute] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    // Form validation
    if (!apiRoute) {
      setError("Please select a recommendation type");
      return;
    }

    setIsLoading(true);
    setApiResponse([]);
    setError("");

    try {
      if (!token) {
        throw new Error("No authentication token found");
      }

      if (!apiRoute || apiRoute === "") {
        setError("Please select a something from the dropdown menu");
        return;
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

      const data = await response.json();

      if (!data.Data || typeof data.Data !== "string") {
        throw new Error("Invalid response format");
      }

      const dataArr = parseRecommendations(data.Data);
      setApiResponse(dataArr);
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
            onChange={(e) => setApiRoute(e.target.value as string)}
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
            <MenuItem value={"recommended-arts-courses-100-200"}>
              Recommend Lower Level Arts Courses (100/200 Level)
            </MenuItem>
            <MenuItem value={"recommended-arts-courses-300"}>
              Recommend Upper Level Arts Courses (300/400 Level)
            </MenuItem>
            <MenuItem value={"recommended-science-courses-100-200"}>
              Recommend Lower Level Science Courses (100/200 Level)
            </MenuItem>
            <MenuItem value={"recommended-science-courses-300"}>
              Recommend Upper Level Science Courses (300/400 Level)
            </MenuItem>
            <MenuItem value={"recommend-upper-level-courses-outside-major"}>
              Recommend Upper Level Courses Outside Major (300/400 Level)
            </MenuItem>
            <MenuItem value={"recommend-upper-level-courses-in-major"}>
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
        <Alert severity="success" className="mt-4 max-w-[720px] mx-10">
          Query successfully submitted! Waiting on Gemini...
        </Alert>
      )}
      {error && (
        <Alert severity="error" className="mt-4 max-w-[720px] mx-10">
          {error}
        </Alert>
      )}
      {apiResponse.length > 0 &&
        apiResponse.map((el) => (
          <div
            className={`w-full max-w-[720px] text-neutral-100 bg-neutral-700 mx-10 my-3 shadow-lg rounded-lg px-3 py-3 flex items-center justify-between mt-4 flex-col font-semibold`}
          >
            {el.course} - {el.description}
          </div>
        ))}
    </div>
  );
}
