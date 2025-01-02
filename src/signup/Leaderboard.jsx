import React, { useState, useEffect } from 'react';
import { generateLeaderboard } from '../store/leaderboard';
import "../tailwind.css"
const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch leaderboard data when the component mounts
  useEffect(() => {
    generateLeaderboard()
      .then((data) => setLeaderboard(data))
      .catch((error) => console.error('Error fetching leaderboard:', error));
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark'); // Toggle dark mode class
  };

  const getUsernameFromEmail = (email) => email.split('@')[0]; // Extract username part

  if (!leaderboard) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-bold text-gray-600 dark:text-gray-300">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
      <button
        onClick={toggleDarkMode}
        className="mb-6 px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded shadow hover:bg-blue-600 dark:hover:bg-blue-800"
      >
        Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>
      {Object.keys(leaderboard).map((teacherEmail) => (
        <div key={teacherEmail} className="mb-10 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">
            Leaderboard for <span className="text-blue-500 dark:text-blue-400">{getUsernameFromEmail(teacherEmail)}</span>
          </h2>
          {Object.keys(leaderboard[teacherEmail]).map((subject) => (
            <div key={subject} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                Subject: <span className="text-green-500 dark:text-green-400">{subject}</span>
              </h3>
              <ul className="bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 divide-y divide-gray-200 dark:divide-gray-600">
                {leaderboard[teacherEmail][subject].map((student, index) => (
                  <li key={student.email} className="px-4 py-2 flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-800 dark:text-gray-100">{index + 1}. {student.name}</span>
                     
                    </div>
                    <span className="text-blue-500 dark:text-blue-300 font-semibold">
                      {student.totalAttendance} presents
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
