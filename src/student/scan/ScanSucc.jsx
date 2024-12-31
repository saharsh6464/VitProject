// SuccessPage.js
import { useContext } from "react";
import { dataContext } from "../../store/data";
import React from "react";
import { useLocation } from 'react-router-dom';
const SuccessPage = () => {
  const {getClassAttendance} = useContext(dataContext);

  const dashData = useLocation();
  console.log("Sucess Location data:")
  console.log(dashData);
  getClassAttendance(dashData);


  return (
    <div className="success-page">
      <h1>Scan Successful</h1>
      <p>Attendance marked successfully!</p>
      <p>{dashData.state.subjectCode}</p>
    </div>
  );
};

export default SuccessPage;
