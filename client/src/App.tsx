import "./../App.css";
import AiRecPage from "./components/AiRecPage";
import CoursesPage from "./components/CoursesPage";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="p-5">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/course-page" element={<CoursesPage />} />
          <Route path="/ai" element={<AiRecPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
