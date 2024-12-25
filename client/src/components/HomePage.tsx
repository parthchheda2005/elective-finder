import { useEffect, useState } from "react";
import Card from "./Card";

export interface Course {
  course: string;
  course_title: string;
  detail?: string;
  id?: number;
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getCourses = async () => {
      setIsLoading(true);
      setCourses([]);
      try {
        const res = await fetch("http://0.0.0.0:8000/", {
          signal: signal,
        });
        const data = await res.json();
        setCourses(data.Data);
        console.log(data.Data);
      } catch (e) {
        console.error("getting courses for home page failed");
      } finally {
        setIsLoading(false);
      }
    };
    getCourses();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="flex justify-center items-center flex-col">
      {courses.map((el) => (
        <Card el={el} key={`${el.course}${el.detail}`}></Card>
      ))}
    </div>
  );
}
