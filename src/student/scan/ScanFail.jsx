// SuccessPage.js
import React from "react";
import { useLocation } from 'react-router-dom';
const FailPage = () => {
    const dashData = useLocation();
  console.log(dashData);
  return (
    <div className="success-page">
      <h1>Scan Rejected</h1>
      <p>Reason:{dashData.state}</p>
    </div>
  );
};

export default FailPage;