import { useEffect, useState } from "react";
import Card from "./Card";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export interface Course {
  course: string;
  course_title: string;
  subject?: string;
  detail?: string;
  id?: number;
}

export interface Subject {
  subject: string;
  subject_title: string;
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subject, setSubject] = useState<string>("");

  const handleChangeSubjectViewing = (e: SelectChangeEvent) => {
    setSubject(e.target.value as string);
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
        console.log(data);
      } catch (e) {
        console.error("Failed to fetch subjects:", e);
      }
    };

    getSubjects();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const getCourses = async () => {
      setIsLoading(true);
      setCourses([]);
      try {
        const res = await fetch(
          subject === ""
            ? "http://0.0.0.0:8000/courses/CPSC"
            : `http://0.0.0.0:8000/courses/${subject}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setCourses(data.Data || []);
        console.log(data.Data);
      } catch (e) {
        console.error("Failed to fetch courses:", e);
      } finally {
        setIsLoading(false);
      }
    };

    getCourses();
    return () => controller.abort();
  }, [subject]);

  useEffect(() => {
    if (subjects.length > 0 && subject === "") {
      setSubject("CPSC");
    }
  }, [subjects]);

  return (
    <div className="flex justify-center items-center flex-col">
      {subjects.length > 0 && (
        <Box sx={{ width: "100%", maxWidth: 400, px: 2 }}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "white" }}>Subject</InputLabel>
            <Select
              value={subject}
              label="Subject"
              onChange={handleChangeSubjectViewing}
              sx={{
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "& .MuiSvgIcon-root": {
                  color: "white",
                },
              }}
            >
              {subjects.map((el) => (
                <MenuItem key={el.subject} value={el.subject}>
                  {`${el.subject} - ${el.subject_title}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
      {isLoading ? (
        <p>Loading courses...</p>
      ) : (
        courses &&
        courses.map((el) => (
          <Card
            el={{ ...el, subject: subject }}
            key={el.id || `${el.course}${el.detail}`}
          />
        ))
      )}
    </div>
  );
}
