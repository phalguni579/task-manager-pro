import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const role = localStorage.getItem("role");

  if (!token) {
    return <Login setToken={setToken} />;
  }

  if (role === "admin") {
    return <Admin setToken={setToken} />;
  }

  // default fallback
  return <Dashboard setToken={setToken} />;
}

export default App;



