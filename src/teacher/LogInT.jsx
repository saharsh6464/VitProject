import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaSun, FaMoon, FaLock, FaEnvelope, FaSmile } from "react-icons/fa";
import { dataContext } from "../store/data";
import { getSavedTeacherCredentials } from "../store/saveCredT";
import "../tailwind.css"

const TeacherLogin = () => {
  const [isLightMode, setIsLightMode] = useState(true);
  const { createclass } = useContext(dataContext);
  const navigate = useNavigate();

  // Auto-login with saved credentials
  const savedCredentials = getSavedTeacherCredentials();
  if (savedCredentials) {
    const obj = {
      role: "Teacher",
      email: savedCredentials.teacherEmail,
      password: savedCredentials.teacherPassword,
    };
    createclass(obj, false);
  }

  // Refs for input fields
  const emailRef = useRef();
  const passwordRef = useRef();

  const toggleTheme = () => {
    setIsLightMode((prevMode) => !prevMode);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const obj = {
      role: "Teacher",
      email: email,
      password: password,
    };
    createclass(obj);

    // Redirect to dashboard (or any route)
    navigate("/teacher-login/dashboard");
  };

  return (
    <div
      className={`${
        isLightMode ? "bg-gray-100 text-gray-900" : "bg-gray-900 text-gray-100"
      } min-h-screen flex flex-col justify-center items-center`}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 px-4 py-2 rounded-md shadow-md font-semibold transition transform hover:scale-105 ${
          isLightMode
            ? "bg-gray-600 hover:bg-gray-500 text-white"
            : "bg-yellow-500 hover:bg-yellow-400 text-gray-900"
        } flex items-center gap-2`}
      >
        {isLightMode ? <FaMoon /> : <FaSun />} {isLightMode ? "Dark Mode" : "Light Mode"}
      </button>

      {/* Login Form */}
      <div
        className={`${
          isLightMode ? "bg-gray-200 text-gray-900" : "bg-gray-800 text-gray-100"
        } p-8 rounded-lg shadow-lg w-11/12 sm:w-96`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          Teacher Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block mb-2 font-medium">
              <FaEnvelope className="inline mr-2" /> Teacher Email
            </label>
            <input
              type="email"
              id="email"
              ref={emailRef}
              className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter teacher email"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block mb-2 font-medium">
              <FaLock className="inline mr-2" /> Teacher Password
            </label>
            <input
              type="password"
              id="password"
              ref={passwordRef}
              className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 rounded-md shadow-md transition transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <FaLock /> Login
          </button>
        </form>

        <div className="flex justify-between items-center mt-4 text-sm">
          <a
            href="#"
            className="text-blue-500 hover:underline flex items-center gap-1"
          >
            <FaSmile /> Forgot Password?
          </a>
          <a
            href="/"
            className="text-blue-500 hover:underline flex items-center gap-1"
          >
            <FaSmile /> Go to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
