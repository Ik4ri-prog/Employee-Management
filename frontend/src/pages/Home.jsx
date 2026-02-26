import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex flex-col justify-center items-center px-4">

      {/* Decorative floating shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl"></div>

      <div className="z-10 text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
          Welcome to Employee Management System
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-12 max-w-lg mx-auto drop-shadow-sm">
          Manage your employees efficiently. Add, edit, and track your staff easily with this intuitive dashboard.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button
            onClick={() => navigate('/login')}
            className="flex-1 bg-white text-green-600 font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition transform"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="flex-1 bg-white text-green-600 font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition transform"
          >
            Register
          </button>
        </div>
      </div>

      {/* Footer or subtle bottom text */}
      <div className="absolute bottom-6 text-white/70 text-sm">
        &copy; {new Date().getFullYear()} Employee Management System. All rights reserved.
      </div>
    </div>
  );
};

export default Home;