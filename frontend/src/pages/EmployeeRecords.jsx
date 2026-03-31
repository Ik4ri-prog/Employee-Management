import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getEmployees, deleteEmployee, updateEmployee } from "../services/employeeService";
import EmployeeForm from "../components/EmployeeForm";
import ConfirmModal from "../components/ConfirmModal";

const EmployeeRecords = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", position: "", department: "", salary: "" });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch employees safely using useCallback
  const fetchEmployees = useCallback(async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch (err) {
      console.error("Fetch Employees Error:", err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Filter employees based on search query
  useEffect(() => {
    const filtered = employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEmployees(filtered);
    setCurrentPage(1); // Reset to first page on new search
  }, [searchQuery, employees]);

  const handleEditClick = (emp) => {
    setEditingId(emp._id);
    setEditForm({
      name: emp.name,
      position: emp.position,
      department: emp.department,
      salary: emp.salary,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      await updateEmployee(id, { ...editForm, salary: Number(editForm.salary) });
      setEditingId(null);
      fetchEmployees();
    } catch (err) {
      console.error("Update Employee Error:", err);
    }
  };

  const handleDeleteClick = (id) => setDeleteConfirmId(id);

  const handleConfirmDelete = async () => {
    try {
      await deleteEmployee(deleteConfirmId);
      fetchEmployees();
    } catch (err) {
      console.error("Delete Employee Error:", err);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleCancelDelete = () => setDeleteConfirmId(null);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Employee Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <EmployeeForm refresh={fetchEmployees} />
        </div>

        {/* Search Bar */}
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search by Name, Position, or Department"
            className="w-full max-w-md border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Employee Records</h2>

          {paginatedEmployees.length === 0 ? (
            <p className="text-gray-500 font-medium">No employees found.</p>
          ) : (
            <table className="w-full border-collapse text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left font-bold">Name</th>
                  <th className="p-3 text-left font-bold">Position</th>
                  <th className="p-3 text-left font-bold">Department</th>
                  <th className="p-3 text-left font-bold">Salary</th>
                  <th className="p-3 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((emp) => (
                  <tr key={emp._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">
                      {editingId === emp._id ? (
                        <input
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                      ) : (
                        emp.name
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === emp._id ? (
                        <input
                          name="position"
                          value={editForm.position}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                      ) : (
                        emp.position
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === emp._id ? (
                        <input
                          name="department"
                          value={editForm.department}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                      ) : (
                        emp.department
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === emp._id ? (
                        <input
                          name="salary"
                          type="number"
                          value={editForm.salary}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                      ) : (
                        formatCurrency(emp.salary)
                      )}
                    </td>
                    <td className="p-3 space-x-3">
                      {editingId === emp._id ? (
                        <>
                          <button
                            onClick={() => handleEditSave(emp._id)}
                            className="text-green-600 font-bold hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-600 font-bold hover:underline"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(emp)}
                            className="text-blue-600 font-bold hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(emp._id)}
                            className="text-red-600 font-bold hover:underline"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 border rounded-md hover:bg-gray-100 ${
                    currentPage === idx + 1 ? "bg-green-100 font-bold" : ""
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirmId}
        title="Confirm Delete"
        message="Are you sure you want to delete this employee?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </DashboardLayout>
  );
};

export default EmployeeRecords;
