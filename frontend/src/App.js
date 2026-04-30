import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/LoginForm";
import Register from "./components/RegisterForm";
import Dashboard from "./pages/Dashboard";
import UserApproval from "./pages/UserApproval";
import EmployeeRecords from "./pages/EmployeeRecords";
import AuditLog from "./pages/AuditLog";
import UserEmployee from "./pages/UserEmployee";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/useremployee" element={<UserEmployee />} />
        <Route path="/userapproval" element={<UserApproval />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employeerecords" element={<EmployeeRecords />} />
        <Route path="/auditlog" element={<AuditLog />} />

      </Routes>
    </Router>
  );
}

export default App;
