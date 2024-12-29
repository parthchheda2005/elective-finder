import { useEffect, useState } from "react";
import { Course } from "./CoursesPage";
import BarGraph from "./BarGraph";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import { Alert } from "@mui/material";

interface CardProps {
  el: Course;
}

interface CourseData {
  average: number;
  high: number;
  low: number;
  median: number;
  percentile_25: number;
  percentile_75: number;
  grades: { [key: string]: number };
}

export default function Card({ el }: CardProps) {
  const [clicked, setClicked] = useState<boolean>(false);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [gradeValue, setGradeValue] = useState<number>(70);
  const [ratingValue, setRatingValue] = useState<number>(3);
  const [hasRating, setHasRating] = useState<boolean>(false);
  const [alert, setAlert] = useState("");

  const token = localStorage.getItem("token");

  const gradeMarks = [
    { value: 0, label: "0" },
    { value: 25, label: "25" },
    { value: 50, label: "50" },
    { value: 75, label: "75" },
    { value: 100, label: "100" },
  ];

  const ratingMarks = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
  ];

  const formatValue = (value: number | null | undefined) => {
    if (value === null || value === undefined) return null;
    return value === 0 ? 0 : Math.round(value * 10) / 10;
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setClicked(false);
    setAlert("");
  };

  useEffect(() => {
    if (!clicked) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [courseResponse, ratingResponse] = await Promise.all([
          fetch(
            `https://elective-finder.onrender.com/courses/${el.subject}/${
              el.course
            }${el.detail && el.detail}`,
            { signal }
          ),
          fetch(
            `https://elective-finder.onrender.com/ratings/${el.subject}/${
              el.course
            }${el.detail || ""}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal,
            }
          ),
        ]);

        if (!courseResponse.ok) throw new Error("Failed to fetch course data");
        if (!ratingResponse.ok) throw new Error("Failed to fetch rating data");

        const [courseDataResult, ratingDataResult] = await Promise.all([
          courseResponse.json(),
          ratingResponse.json(),
        ]);

        setCourseData(courseDataResult);

        // Update rating states if rating exists
        if (ratingDataResult.found) {
          setHasRating(true);
          setGradeValue(ratingDataResult.grade);
          setRatingValue(ratingDataResult.rating);
        }
      } catch (e: any) {
        setError(e.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [clicked, el.subject, el.course, el.detail]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const addRating = async () => {
    try {
      const response = await fetch(
        "https://elective-finder.onrender.com/create-rating",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            course: `${el.course}${el.detail}`,
            subject: el.subject,
            course_title: el.course_title,
            grade: gradeValue,
            rating: ratingValue,
          }),
        }
      );
      setAlert("Rating added successfully!");
      setHasRating(true);
    } catch (e) {
      console.error("Something went wrong adding course");
    }
  };

  const updateRating = async () => {
    try {
      const response = await fetch(
        `https://elective-finder.onrender.com/update-rating/${el.subject}/${
          el.course
        }${el.detail || ""}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            course: `${el.course}${el.detail}`,
            subject: el.subject,
            course_title: el.course_title,
            grade: gradeValue,
            rating: ratingValue,
          }),
        }
      );

      setAlert("Rating updated successfully!");
      setHasRating(true);
    } catch (e) {
      console.error("Something went wrong updating course");
    }
  };

  const removeRating = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(
        `https://elective-finder.onrender.com/remove-rating/${el.subject}/${
          el.course
        }${el.detail && el.detail}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlert("Course rating successfully deleted!");
      setHasRating(false);
    } catch (e) {
      console.error("Something went wrong with removing rating");
    }
  };

  return (
    <div
      onClick={() => setClicked(true)}
      className={`w-full max-w-[720px] text-neutral-100 bg-neutral-700 mx-10 my-3 shadow-lg rounded-lg px-3 py-3 flex items-center justify-between mt-4 block ${
        !clicked && `lg:hover:scale-110 transition duration-150`
      } flex-col`}
    >
      <div className="flex flex-row justify-between w-full">
        <h1 className="text-left font-bold">
          {`${el.subject}${el.course}${el.detail && el.detail} ${
            hasRating ? "⭐️" : ""
          }`}
        </h1>
        <h1 className="text-right font-bold">{el.course_title}</h1>
      </div>
      {clicked && (
        <div className="w-full mx-3 my-2">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : courseData ? (
            <>
              <div className="flex sm:flex-row sm:justify-between justify-evenly w-full space-x-4 flex-wrap">
                <h2>Average: {formatValue(courseData.average) ?? "-"}</h2>
                <h2>High: {formatValue(courseData.high) ?? "-"}</h2>
                <h2>Low: {formatValue(courseData.low) ?? "-"}</h2>
                <h2>Median: {formatValue(courseData.median) ?? "-"}</h2>
                <h2>
                  Lower Quartile: {formatValue(courseData.percentile_25) ?? "-"}
                </h2>
                <h2>
                  Upper Quartile: {formatValue(courseData.percentile_75) ?? "-"}
                </h2>
              </div>
              <div className="mt-4">
                <BarGraph data={courseData.grades} />
              </div>
              <div className="mt-4 flex flex-col items-center justify-center">
                <Box sx={{ width: 300 }}>
                  <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">
                      Grade Earned: {`${gradeValue}%`}
                    </label>
                    <Slider
                      value={gradeValue}
                      onChange={(_, newValue) =>
                        setGradeValue(newValue as number)
                      }
                      aria-label="Grade"
                      valueLabelDisplay="auto"
                      marks={gradeMarks}
                      min={0}
                      max={100}
                      sx={{
                        "& .MuiSlider-markLabel": {
                          color: "white",
                        },
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                      Course Rating: {`${ratingValue} ⭐️`}
                    </label>
                    <Slider
                      value={ratingValue}
                      onChange={(_, newValue) =>
                        setRatingValue(newValue as number)
                      }
                      aria-label="Rating"
                      valueLabelDisplay="auto"
                      marks={ratingMarks}
                      sx={{
                        "& .MuiSlider-markLabel": {
                          color: "white",
                        },
                      }}
                      min={1}
                      max={5}
                      step={1}
                    />
                  </div>
                </Box>
              </div>
            </>
          ) : null}
          <div className="mt-4 flex justify-center items-center flex-col">
            {hasRating ? (
              <div className="flex justify-evenly items-center flex-row">
                <div className="mr-3">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={updateRating}
                    style={{ minWidth: "130px", maxWidth: "130px" }}
                  >
                    Update Rating
                  </Button>
                </div>
                <Button
                  variant="contained"
                  color="error"
                  onClick={removeRating}
                  style={{ minWidth: "130px", maxWidth: "130px" }}
                >
                  Remove Rating
                </Button>
              </div>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={addRating}
                style={{ minWidth: "130px", maxWidth: "130px" }}
              >
                Add Rating
              </Button>
            )}
            {alert != "" && (
              <div className="mt-3">
                <Alert severity="success">{alert}</Alert>
              </div>
            )}
            <div className="mt-3">
              <Button
                variant="contained"
                onClick={handleClose}
                style={{ minWidth: "130px", maxWidth: "130px" }}
              >
                Close Tab
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
