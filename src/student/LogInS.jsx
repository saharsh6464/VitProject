import React, { useState, useRef, useContext } from "react";
import { FaSun, FaMoon, FaEnvelope, FaLock } from "react-icons/fa";
import { Form, useNavigate } from "react-router-dom";
import { dataContext } from "../store/data";
import { getSavedCredentials } from "../store/saveCredS";
import { resetPassword } from "../store/auth";
import "../tailwind.css";
const LoginPage = () => {
  const { createclass } = useContext(dataContext);
  const emailRef = useRef();
  const passwordRef = useRef();
  const teacherEmailRef = useRef();
  const navigate = useNavigate();
  const [isLightMode, setIsLightMode] = useState(true);

  const toggleTheme = () => {
    setIsLightMode((prevMode) => !prevMode);
  };

  const savedCredentials = getSavedCredentials();
  if (savedCredentials !== null) {
    const obj = {
      role: "Student",
      email: savedCredentials.studentEmail,
      password: savedCredentials.studentPassword,
      name: savedCredentials.teacherEmail,
    };
    createclass(obj, false);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const teacherEmail = formData.get("teacherEmail");

    const obj = {
      role: "Student",
      email,
      password,
      name: teacherEmail,
    };
    createclass(obj);
    // Add navigation logic if necessary, e.g., navigate("/dashboard");
  };

  const handleResetPassword = () => {
    const email = emailRef.current.value;
    resetPassword(email);
    alert(`Password reset instructions sent to: ${email}`);
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
          isLightMode
            ? "bg-gray-200 text-gray-900"
            : "bg-gray-800 text-gray-100"
        } p-8 rounded-lg shadow-lg w-11/12 sm:w-96`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <Form method="post" onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block mb-2 font-medium">
              <FaEnvelope className="inline mr-2" /> Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              ref={emailRef}
              className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter email"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block mb-2 font-medium">
              <FaLock className="inline mr-2" /> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              ref={passwordRef}
              className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter password"
              required
            />
          </div>

          {/* Teacher Email Field */}
          <div>
            <label htmlFor="teacherEmail" className="block mb-2 font-medium">
              <FaEnvelope className="inline mr-2" /> Teacher Email
            </label>
            <input
              type="email"
              id="teacherEmail"
              name="teacherEmail"
              ref={teacherEmailRef}
              className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter teacher email"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 rounded-md shadow-md transition transform hover:scale-105"
          >
            Login
          </button>
        </Form>

        {/* Reset Password and Home Links */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            onClick={handleResetPassword}
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
          <a href="/" className="text-blue-500 hover:underline">
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
