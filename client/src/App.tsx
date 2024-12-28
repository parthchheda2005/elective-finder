import "./../App.css";
import CoursesPage from "./components/CoursesPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";

function App() {
  return (
    <div className="p-5">
      <RegisterPage />
      {/* <LoginPage></LoginPage> */}
      {/* <CoursesPage></CoursesPage> */}
    </div>
  );
}

export default App;
