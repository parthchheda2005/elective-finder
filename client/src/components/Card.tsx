import { useEffect, useState } from "react";
import { Course } from "./homePage";
import BarGraph from "./BarGraph";

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
  const [clicked, setClicked] = useState(false);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!clicked || courseData) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const getCourseData = async () => {
      setIsLoading(true);
      setCourseData(null);
      setError(null); // Clear previous errors
      try {
        const res = await fetch(
          `http://0.0.0.0:8000/${el.subject}/${el.course}${
            el.detail && el.detail
          }`,
          {
            signal: signal,
          }
        );
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setCourseData(data);
      } catch (e: any) {
        setError(e.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    getCourseData();

    return () => {
      controller.abort();
    };
  }, [clicked, courseData, el.course, el.detail]);

  const formatValue = (value: number | null | undefined) => {
    if (value === null || value === undefined) return null;
    return value === 0 ? 0 : Math.round(value * 10) / 10;
  };

  return (
    <div
      onClick={() => setClicked(!clicked)}
      className="w-full max-w-[720px] text-neutral-100 bg-neutral-700 mx-10 my-3 shadow-lg rounded-lg px-3 py-3 flex items-center justify-between lg:hover:scale-110 transition duration-300 flex-col"
    >
      <div className="flex flex-row justify-between w-full">
        <h1 className="text-left font-bold">
          {`${el.subject}${el.course}${el.detail && el.detail}`}
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
            </>
          ) : (
            <p>No data available</p>
          )}
        </div>
      )}
    </div>
  );
}
