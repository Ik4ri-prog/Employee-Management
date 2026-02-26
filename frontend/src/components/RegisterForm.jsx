import React, { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorType, setErrorType] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      setShowSuccess(true); // show success modal
    } catch (err) {
      const message = err.response?.data?.message || "";

      if (message.toLowerCase().includes("exists")) {
        setErrorType("exists");
      } else {
        setErrorType("failed");
      }
    }
  };

  const closeErrorModal = () => setErrorType(null);

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md relative">

        <button
          className="absolute top-5 left-5 flex items-center text-gray-600 hover:text-gray-800"
          onClick={() => navigate("/")}
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back
        </button>

        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Password</label>
            <input
              type="password"
              placeholder="********"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500">
          Already have an account?{" "}
          <button
            className="text-green-600 font-medium hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </div>

      {/* ERROR MODAL */}
      {errorType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center">

            {errorType === "exists" && (
              <>
                <h3 className="text-lg font-bold text-red-600 mb-3">
                  Email Already Exists
                </h3>
                <p className="text-gray-600 mb-6">
                  An account with this email already exists.
                </p>
              </>
            )}

            {errorType === "failed" && (
              <>
                <h3 className="text-lg font-bold text-red-600 mb-3">
                  Registration Failed
                </h3>
                <p className="text-gray-600 mb-6">
                  Something went wrong. Please try again.
                </p>
              </>
            )}

            <button
              onClick={closeErrorModal}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center">
            <h3 className="text-lg font-bold text-green-600 mb-3">
              Registration Successful
            </h3>
            <p className="text-gray-600 mb-6">
              Your account has been created and is pending admin approval.
            </p>
            <button
              onClick={handleSuccessClose}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
