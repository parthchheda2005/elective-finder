import "./../App.css";
import CoursesPage from "./components/CoursesPage";
import HomePage from "./components/homePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";

function App() {
  return (
    <div className="p-5">
      <HomePage />
      {/* <RegisterPage /> */}
      {/* <LoginPage></LoginPage> */}
      {/* <CoursesPage></CoursesPage> */}
    </div>
  );
}

export default App;
