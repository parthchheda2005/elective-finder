import { useNavigate } from "react-router-dom";

export default function AiRecPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <button
        onClick={() => navigate("/course-page")}
        className="p-2 bg-indigo-200 text-[#242424] rounded transition-all duration-300 hover:bg-blue-300 hover:scale-105 w-fit mt-2 mb-4"
      >
        go look at courses.
      </button>
      <h1 className="text-3xl">under construction.</h1>
    </div>
  );
}
