import { useEffect, useState, useCallback } from "react";
import { getEmployees } from "../services/employeeService";

const UserEmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [searchQuery, setSearchQuery] = useState("");

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch (err) {
      console.error("Fetch Employees Error:", err);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Filter
  useEffect(() => {
    const filtered = employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredEmployees(filtered);
    setCurrentPage(1);
  }, [searchQuery, employees]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER / NAVBAR */}
      <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          Employee Portal
        </h1>

        <div className="text-sm">
        <button
            onClick={() => {
            localStorage.removeItem("token"); 
            window.location.href = "/login"; 
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
            Logout
        </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">

        {/* SEARCH + ACTION BAR */}
        <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

          <input
            type="text"
            placeholder="Search employee..."
            className="border rounded-lg px-3 py-2 w-full md:w-1/2 focus:ring-2 focus:ring-green-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Refresh
            </button>

          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">

          <h2 className="text-lg font-bold mb-4">
            Employee Directory
          </h2>

          {paginatedEmployees.length === 0 ? (
            <p className="text-gray-500">No employees found.</p>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Position</th>
                  <th className="p-3">Department</th>
                </tr>
              </thead>

              <tbody>
                {paginatedEmployees.map((emp) => (
                  <tr key={emp._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{emp.name}</td>
                    <td className="p-3">{emp.position}</td>
                    <td className="p-3">{emp.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? "bg-green-200" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserEmployeePage;