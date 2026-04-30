import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorType, setErrorType] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", res.data.email);

      if (res.data.role === "admin") {
        navigate("/Dashboard");
      } else {
        navigate("/UserEmployee");
      }

    } catch (err) {
      const message = err.response?.data?.message || "";

      if (message.toLowerCase().includes("pending")) {
        setErrorType("pending");
      } else if (message.toLowerCase().includes("denied")) {
        setErrorType("denied");
      } else {
        setErrorType("invalid");
      }
    }
  };

  const closeModal = () => setErrorType(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md relative">

        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500">
          No account?{" "}
          <Link
            to="/register"
            className="text-green-600 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>

      {/* ERROR MODAL */}
      {errorType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center">

            {errorType === "invalid" && (
              <>
                <h3 className="text-lg font-bold text-red-600 mb-3">
                  Wrong Credentials
                </h3>
                <p className="text-gray-600 mb-6">
                  The email or password you entered is incorrect.
                </p>
              </>
            )}

            {errorType === "pending" && (
              <>
                <h3 className="text-lg font-bold text-yellow-600 mb-3">
                  Account Pending
                </h3>
                <p className="text-gray-600 mb-6">
                  Your account is waiting for admin approval.
                </p>
              </>
            )}

            {errorType === "denied" && (
              <>
                <h3 className="text-lg font-bold text-red-600 mb-3">
                  Account Denied
                </h3>
                <p className="text-gray-600 mb-6">
                  Your account has been denied. Please contact the administrator.
                </p>
              </>
            )}

            <button
              onClick={closeModal}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
