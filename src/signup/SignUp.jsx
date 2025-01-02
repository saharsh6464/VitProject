import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import instituteLogo from "../assets/nie-campus-og.jpg";

const AttendancePortal = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col justify-between transition-colors duration-500 ${
        isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900'
      }`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${instituteLogo})` }}
      ></div>

      {/* Header Section */}
      <header className="relative z-10 py-6 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">ATTENDANCE PORTAL</h1>
          <div className="flex space-x-4 items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!isDarkMode}
                onChange={toggleTheme}
                className="sr-only"
              />
              <div
                className={`w-11 h-6 rounded-full peer ${
                  isDarkMode ? 'bg-gray-400' : 'bg-gray-800'
                } transition-colors duration-500`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow transition-transform transform ${
                    isDarkMode
                      ? 'bg-gray-700 translate-x-0'
                      : 'bg-gray-200 translate-x-5'
                  }`}
                ></span>
              </div>
            </label>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <main className="relative z-10 flex-grow flex flex-col items-center px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center w-full max-w-6xl">
          {/* Student Section */}
          <div className="flex flex-col items-center animate-fade-in">
            <img
              src="https://thumbs.dreamstime.com/b/student-icon-white-background-71302919.jpg"
              alt="Student"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-35 md:h-28 lg:w-32 lg:h-32 rounded-full shadow-lg mb-4 hover:scale-105 transform transition duration-300"
            />
            <Link
              to="/student-login"
              className="font-semibold py-2 px-3 sm:px-4 md:px-6 rounded-md shadow-md focus:outline-none transform hover:scale-110 transition duration-300 bg-blue-500 hover:bg-blue-400 text-white"
            >
              Student Login
            </Link>
          </div>

          {/* Teacher Section */}
          <div className="flex flex-col items-center animate-fade-in">
            <img
              src="https://static.vecteezy.com/system/resources/previews/034/780/631/non_2x/teacher-icon-on-white-background-simple-illustration-free-vector.jpg"
              alt="Teacher"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full shadow-lg mb-4 hover:scale-105 transform transition duration-300"
            />
            <Link
              to="/teacher-login"
              className="font-semibold py-2 px-3 sm:px-4 md:px-6 rounded-md shadow-md focus:outline-none transform hover:scale-110 transition duration-300 bg-blue-500 hover:bg-blue-400 text-white"
            >
              Teacher Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`relative z-10 py-8 px-4 text-center flex flex-col items-center ${'bg-gray-900 text-gray-400'
        }`}
      >
        <div className="text-sm">No 50, Koorgalli Village, Hootagalli Industrial Area, next to BEML, Mysuru, Karnataka 570018</div>
        <div className="text-sm mt-4">&copy; 2024 All Rights Reserved</div>
      </footer>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 1.5s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default AttendancePortal;
