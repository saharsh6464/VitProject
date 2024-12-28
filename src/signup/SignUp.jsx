import React from 'react';
import './SignUp.css'; // Import your CSS file
import instituteLogo from "../assets/nie-campus-og.jpg";
import { Link } from 'react-router-dom';

import { getDatabase, ref, update } from "firebase/database";

const hardcodeData = () => {
  const db = getDatabase();

  // Data to be hardcoded
  const hardcodedData = {
    students: {
      "student1@example,com": {
        name: "Alice Johnson",
        subjects: {
          AI: {
            "1208122024": { date: "07/12/2024", status: 1 },
            "1108122024": { date: "06/12/2024", status: 0 },
            "1008122024": { date: "05/12/2024", status: 1 },
            "0908122024": { date: "04/12/2024", status: 1 },
            "0808122024": { date: "03/12/2024", status: 0 },
            "0708122024": { date: "02/12/2024", status: 1 },
            "0608122024": { date: "01/12/2024", status: 1 },
            "0508122024": { date: "30/11/2024", status: 0 },
            "0408122024": { date: "29/11/2024", status: 1 },
            "0308122024": { date: "28/11/2024", status: 1 },
            code: "AI2024"
          },
          DSA: {
            "1208122024": { date: "07/12/2024", status: 0 },
            "1108122024": { date: "06/12/2024", status: 1 },
            "1008122024": { date: "05/12/2024", status: 1 },
            "0908122024": { date: "04/12/2024", status: 0 },
            "0808122024": { date: "03/12/2024", status: 0 },
            "0708122024": { date: "02/12/2024", status: 1 },
            "0608122024": { date: "01/12/2024", status: 1 },
            "0508122024": { date: "30/11/2024", status: 1 },
            "0408122024": { date: "29/11/2024", status: 1 },
            "0308122024": { date: "28/11/2024", status: 1 },
            code: "DSA2024"
          },
          MATHS: {
            "1208122024": { date: "07/12/2024", status: 1 },
            "1108122024": { date: "06/12/2024", status: 1 },
            "1008122024": { date: "05/12/2024", status: 0 },
            "0908122024": { date: "04/12/2024", status: 1 },
            "0808122024": { date: "03/12/2024", status: 1 },
            "0708122024": { date: "02/12/2024", status: 1 },
            "0608122024": { date: "01/12/2024", status: 0 },
            "0508122024": { date: "30/11/2024", status: 0 },
            "0408122024": { date: "29/11/2024", status: 1 },
            "0308122024": { date: "28/11/2024", status: 1 },
            code: "MATHS2024"
          }
        }
      },
      "student2@example,com": {
        name: "Bob Smith",
        subjects: {
          AI: {
            "1208122024": { date: "07/12/2024", status: 1 },
            "1108122024": { date: "06/12/2024", status: 0 },
            "1008122024": { date: "05/12/2024", status: 1 },
            "0908122024": { date: "04/12/2024", status: 1 },
            "0808122024": { date: "03/12/2024", status: 0 },
            "0708122024": { date: "02/12/2024", status: 1 },
            "0608122024": { date: "01/12/2024", status: 1 },
            "0508122024": { date: "30/11/2024", status: 0 },
            "0408122024": { date: "29/11/2024", status: 1 },
            "0308122024": { date: "28/11/2024", status: 1 },
            code: "AI2024"
          },
          DSA: {
            "1208122024": { date: "07/12/2024", status: 0 },
            "1108122024": { date: "06/12/2024", status: 1 },
            "1008122024": { date: "05/12/2024", status: 1 },
            "0908122024": { date: "04/12/2024", status: 0 },
            "0808122024": { date: "03/12/2024", status: 0 },
            "0708122024": { date: "02/12/2024", status: 1 },
            "0608122024": { date: "01/12/2024", status: 1 },
            "0508122024": { date: "30/11/2024", status: 1 },
            "0408122024": { date: "29/11/2024", status: 1 },
            "0308122024": { date: "28/11/2024", status: 1 },
            code: "DSA2024"
          },
          MATHS: {
            "1208122024": { date: "07/12/2024", status: 1 },
            "1108122024": { date: "06/12/2024", status: 1 },
            "1008122024": { date: "05/12/2024", status: 0 },
            "0908122024": { date: "04/12/2024", status: 1 },
            "0808122024": { date: "03/12/2024", status: 1 },
            "0708122024": { date: "02/12/2024", status: 1 },
            "0608122024": { date: "01/12/2024", status: 0 },
            "0508122024": { date: "30/11/2024", status: 0 },
            "0408122024": { date: "29/11/2024", status: 1 },
            "0308122024": { date: "28/11/2024", status: 1 },
            code: "MATHS2024"
          }
        }
      },
      // Add 4 more students here following the same format
    },
    subjects: "AI DSA MATHS"
  };

  // Path in Firebase to update
  const teacherRef = ref(db, "teachers/teacher1@gmail,com");

  // Update the database with hardcoded data
  update(teacherRef, hardcodedData)
    .then(() => {
      console.log("Data hardcoded successfully!");
    })
    .catch((error) => {
      console.error("Error hardcoding data:", error);
    });
};



const AttendancePortal = () => {
  hardcodeData();
  return (
    <div className="container">
      <div id="header">
        <h1>ATTENDANCE PORTAL</h1>
        <div>
          <Link to={'/student-login'} id="signInButton">Student Sign In</Link>
          <Link to={'/teacher-login'} id="signInButton">Faculty Sign In</Link>
        </div>
      </div>

      <div id="background">
        <div className="overlay"></div>
        <img src={instituteLogo} alt="Institute Logo" className="overlay-image" />
      </div>

      <div id="loginMessage"></div>
      <div id="attendanceMessage"></div>

      <footer id="footer">
        <p>No 50, Koorgalli Village, Hootagalli Industrial Area, next to BEML, Mysuru, Karnataka 570018</p>
        <p>&copy; 2024 All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default AttendancePortal;




