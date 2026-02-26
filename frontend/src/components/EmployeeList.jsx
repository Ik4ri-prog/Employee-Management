import React, { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee } from '../services/employeeService';

const EmployeeList = ({ setSelectedEmployee }) => {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    const res = await getEmployees();
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await deleteEmployee(id);
      fetchEmployees();
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {employees.map((emp) => (
        <div key={emp._id} className="bg-white shadow-md rounded p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xl mb-2">{emp.name}</h3>
            <p className="text-gray-600">{emp.email}</p>
            <p className="text-gray-600">{emp.position}</p>
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setSelectedEmployee(emp)}
              className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(emp._id)}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeList;