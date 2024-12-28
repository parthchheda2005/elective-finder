import "./../App.css";
import HomePage from "./components/homePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";

function App() {
  return (
    <div className="p-5">
      <RegisterPage />
      {/* <LoginPage></LoginPage> */}
      {/* <HomePage></HomePage> */}
    </div>
  );
}

export default App;
