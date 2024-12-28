import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-screen flex-col text-center">
      <h1 className="font-extrabold text-5xl">find your dream elective.</h1>
      <h2 className="font-semibold text-xl m-2">
        welcome to your ai powered elective finder.
      </h2>
      <div className="w-full flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => navigate("/register")}
          className="p-2 bg-emerald-200 text-[#242424] rounded w-28 transition-all duration-300 hover:bg-emerald-300 hover:scale-105"
        >
          register
        </button>
        <button
          onClick={() => navigate("/login")}
          className="p-2 bg-indigo-200 text-[#242424] rounded w-28 transition-all duration-300 hover:bg-blue-300 hover:scale-105"
        >
          login
        </button>
      </div>
    </div>
  );
}
