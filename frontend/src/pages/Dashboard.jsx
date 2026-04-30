import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getEmployees } from "../services/employeeService";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch (err) {
      console.error("Fetch Employees Error:", err);
    }
  }, []);

const token = localStorage.getItem("token");

const fetchUsers = useCallback(async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers(res.data);
  } catch (err) {
    console.error("Fetch Users Error:", err.response?.data || err.message);
  }
}, [token]);

  useEffect(() => {
    fetchEmployees();
    fetchUsers();
  }, [fetchEmployees, fetchUsers]);

  const totalEmployees = employees.length;
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const totalUsers = users.length;
  const totalPendingUsers = users.filter(u => u.status === "pending").length;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const exportEmployeesCSV = () => {
    if (employees.length === 0) return;

    const headers = ["Name", "Position", "Department", "Salary"];
    const csvRows = [
      headers.join(","), 
      ...employees.map(emp =>
        [emp.name, emp.position, emp.department, emp.salary].join(",")
      )
    ];
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "employees.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center">
            <span className="text-gray-500 font-semibold">Total Employees</span>
            <span className="text-4xl font-bold text-gray-800 mt-2">{totalEmployees}</span>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center">
            <span className="text-gray-500 font-semibold">Total Salary</span>
            <span className="text-4xl font-bold text-gray-800 mt-2">{formatCurrency(totalSalary)}</span>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center">
            <span className="text-gray-500 font-semibold">Total Users</span>
            <span className="text-4xl font-bold text-gray-800 mt-2">{totalUsers}</span>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center">
            <span className="text-gray-500 font-semibold">Pending Users</span>
            <span className="text-4xl font-bold text-yellow-600 mt-2">{totalPendingUsers}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/employeerecords")}
            className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
          >
            View Employee Records
          </button>
          <button
            onClick={() => navigate("/userapproval")}
            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Manage User Approvals
          </button>
          <button
            onClick={exportEmployeesCSV}
            className="flex-1 bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-600 transition"
          >
            Export Employees CSV
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-gray-600 font-medium">
          <p>
            Welcome, Admin! Use the quick actions above to navigate, manage employees, or approve new users. 
            All stats and totals are live and fetched directly from the database.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
