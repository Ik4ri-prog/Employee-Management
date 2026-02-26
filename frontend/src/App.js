import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/LoginForm";
import Register from "./components/RegisterForm";
import Dashboard from "./pages/Dashboard";
import UserApproval from "./pages/UserApproval";
import EmployeeRecords from "./pages/EmployeeRecords";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userapproval" element={<UserApproval />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employeerecords" element={<EmployeeRecords />} />
      </Routes>
    </Router>
  );
}

export default App;