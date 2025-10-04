import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard"; // create this later
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Wallets from "./pages/Wallets";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/wallets" element={<Wallets />} />

      </Routes>
    </Router>
  );
}

export default App;


