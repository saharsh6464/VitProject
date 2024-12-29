import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { dataContext } from "../store/data";
import { Link } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database"; // Ensure these imports are valid
import "./dashboard.css";
import { logout } from "../store/saveCredS";
const encodeKey = (key) => key.replace(/\./g, ",");

const fetchSubjects = async (teacherEmail) => {
  try {
    const encodedEmail = encodeKey(teacherEmail);
    const db = getDatabase();
    const teacherRef = ref(db, `teachers/${encodedEmail}/subjects`);

    const snapshot = await get(teacherRef);
    if (snapshot.exists()) {
      const subjectsString = snapshot.val(); // Example: "math science english"
      console.log(subjectsString);
      return subjectsString.split(" ").map((subject) => ({
        name: subject.charAt(0).toUpperCase() + subject.slice(1), // Capitalize first letter
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
};

function DashboardS() {
  const { personDetails } = useContext(dataContext);
  const [subjectsArray, setSubjectsArray] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndSetSubjects = async () => {
      if (personDetails && personDetails.name) {
        const subjects = await fetchSubjects(personDetails.name);
        console.log(subjects);
        setSubjectsArray(subjects);
      }
    };

    fetchAndSetSubjects();
  }, [personDetails]);

  const getAttendance = () => {
    navigate("/student-login/dashboard/get-Attendance");
  };

  return (
    <div className="container">
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <h2>Dashboard</h2>
          <div className="user">{personDetails?.email || "User"}</div>
        </header>

        {/* Action Buttons */}
        <div className="actions">
          <div onClick={getAttendance} className="action-box take-attendance">
            Take Attendance
          </div>
          <Link
            className="action-box view-attendance"
            to={{
              pathname: "/student-login/dashboard/viewAttd",
            }}
            state={{
              teacherEmail: personDetails?.name,
              studentEmail: personDetails?.email,
            }}
          >
            View Attendance
          </Link>
          <Link
            onClick={logout}
            className="action-box view-attendance"
            to={{
              pathname: "/student-login",
            }}
          >
            logout
          </Link>
        </div>

        {/* Class Table */}
        <div className="class-table">
          <div className="table-header">Classes Taken by You this Semester</div>
          <table>
            <thead>
              <tr>
                <th>Subject Name</th>
              </tr>
            </thead>
            <tbody>
              {subjectsArray.length > 0 ? (
                subjectsArray.map((subject, index) => (
                  <tr key={index}>
                    <td>{subject.name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="1">No classes found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer id="footer">
        <p>
          No 50, Koorgalli Village, Hootagalli Industrial Area, next to BEML,
          Mysuru, Karnataka 570018
        </p>
        <p>&copy; 2024 All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default DashboardS;


