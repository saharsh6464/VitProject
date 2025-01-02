// SuccessPage.js
import React from "react";
import { useLocation } from 'react-router-dom';

const FailPage = () => {
  const dashData = useLocation();
  console.log(dashData);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Scan Rejected</h1>
        <p className="text-lg">Reason: <span className="font-medium text-gray-700 dark:text-gray-300">{dashData.state}</span></p>
      </div>
    </div>
  );
};

export default FailPage;
