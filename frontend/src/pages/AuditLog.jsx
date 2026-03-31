import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getAuditLogs } from "../services/auditService";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await getAuditLogs();
      setLogs(res.data);
    } catch (err) {
      console.error("Fetch Logs Error:", err);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter(
    (log) =>
      log.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.performedBy || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastLog = currentPage * perPage;
  const indexOfFirstLog = indexOfLastLog - perPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / perPage);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Audit Logs</h2>
        </div>

        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search by Model, Action, or User"
            className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-2xl shadow p-6 overflow-x-auto">
          {currentLogs.length === 0 ? (
            <p className="text-gray-500 font-medium">No logs found.</p>
          ) : (
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Model</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Action</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Document ID</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Performed By</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log) => (
                  <tr key={log._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-2">{log.model}</td>
                    <td className="px-4 py-2">{log.action}</td>
                    <td className="px-4 py-2">{log.documentId}</td>
                    <td className="px-4 py-2">{log.performedBy || "system"}</td>
                    <td className="px-4 py-2">
                      {new Date(log.timestamp).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === i + 1
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                } font-bold`}
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

export default AuditLogs;