// SuccessPage.js
import { useContext } from "react";
import { dataContext } from "../../store/data";
import React from "react";
import { useLocation } from 'react-router-dom';
import { updateStreaks } from "../../store/gamification";
const SuccessPage = () => {
  const { getClassAttendance,personDetails } = useContext(dataContext);

  const dashData = useLocation(personDetails.name,personDetails.email);
  console.log("Success Location data:");
  console.log(dashData);
  getClassAttendance(dashData);
  updateStreaks(personDetails.name,personDetails.email);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Scan Successful</h1>
        <p className="text-lg mb-2">Attendance marked successfully!</p>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Subject Code: {dashData.state.subjectCode}</p>
      </div>
    </div>
  );
};

export default SuccessPage;

