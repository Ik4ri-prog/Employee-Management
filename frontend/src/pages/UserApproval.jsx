import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import axios from "axios";

const UserApproval = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5); // number of users per page

  // Fetch users from backend
  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update user status
  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/users/${id}`, { status });
    fetchUsers();
  };

  // Filter users by search
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastUser = currentPage * perPage;
  const indexOfFirstUser = indexOfLastUser - perPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / perPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-6 space-y-6">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            User Approval Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and manage user registration requests.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-end">
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent w-64"
          />
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {users.length === 0 ? (
            <div className="py-16 text-center text-gray-400 font-bold text-lg">
              No registered users available.
            </div>
          ) : (
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Email</th>
                  <th className="px-6 py-4 text-left font-bold">Status</th>
                  <th className="px-6 py-4 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-bold">{user.email}</td>

                    <td className="px-6 py-4">
                      {user.status === "approved" && (
                        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-bold">
                          Approved
                        </span>
                      )}
                      {user.status === "denied" && (
                        <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600 font-bold">
                          Denied
                        </span>
                      )}
                      {user.status === "pending" && (
                        <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 font-bold">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => updateStatus(user._id, "approved")}
                        className="px-4 py-1.5 text-xs rounded-md border border-green-200 text-green-700 font-bold hover:bg-green-50 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(user._id, "denied")}
                        className="px-4 py-1.5 text-xs rounded-md border border-red-200 text-red-600 font-bold hover:bg-red-50 transition"
                      >
                        Deny
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                } font-bold transition`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default UserApproval;