import { useState } from "react";
import { addEmployee } from "../services/employeeService";

const EmployeeForm = ({ refresh }) => {
  const [form, setForm] = useState({
    name: "",
    position: "",
    department: "",
    salary: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); 
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.name || !form.position || !form.department || !form.salary) {
      setError("All fields are required.");
      return;
    }

    if (isNaN(form.salary)) {
      setError("Salary must be a number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addEmployee({ ...form, salary: Number(form.salary) });
      setMessage("Employee added successfully!");
      setForm({ name: "", position: "", department: "", salary: "" });
      refresh(); // refresh the employee list
    } catch (err) {
      console.error("Add Employee Error:", err);
      setError(err.response?.data?.message || "Failed to add employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Add Employee</h2>

      {message && (
        <p className="bg-green-100 text-green-700 p-2 rounded mb-4">{message}</p>
      )}
      {error && (
        <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="position"
          placeholder="Position"
          value={form.position}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="salary"
          placeholder="Salary"
          type="number"
          value={form.salary}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition md:col-span-4"
        >
          {loading ? "Adding..." : "Add Employee"}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;