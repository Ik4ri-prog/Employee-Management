import { Link } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        {/* Top section: Logo and nav */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold mb-10 text-blue-600">EmployeeMS</h1>
          <nav className="flex flex-col gap-4">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Admin Dashboard
            </Link>
            <Link
              to="/employeerecords"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Employee Records
            </Link>
            <Link
              to="/userapproval"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              User Approval
            </Link>
            <Link
              to="/auditlog"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Audit Log
            </Link>
          </nav>
        </div>

        {/* Bottom section: Logout */}
        <div className="mt-6">
          <Link
            to="/login"
            className="text-red-600 hover:underline font-medium"
          >
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Employee Management System
          </h2>
        </header>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
