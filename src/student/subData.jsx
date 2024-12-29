import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { dataContext } from "../store/data"; // Context for user data
// import "./StudentSubjects.css"; // Add custom styles

const encodeKey = (key) => key.replace(/\./g, ",");

const StudentSubjects = () => {
  const [subjectsData, setSubjectsData] = useState([]);
  const [error, setError] = useState("");
  const { personDetails } = useContext(dataContext); // Logged-in student email
  const studentEmail = personDetails.email; // Replace with the logged-in student's email
  const teacherEmail = personDetails.name;
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjectsData();
  }, []);

  const fetchSubjectsData = async () => {
    if (!studentEmail) {
      setError("Student email not found. Please log in again.");
      return;
    }

    setError("");
    const db = getDatabase();
    const studentRef = ref(db, `teachers/${encodeKey(teacherEmail)}/students/${encodeKey(studentEmail)}/subjects`);

    try {
      const snapshot = await get(studentRef);
      if (snapshot.exists()) {
        const subjects = snapshot.val();

        // Format attendance data
        const formattedData = Object.entries(subjects).map(([subjectName, attendance]) => {
          const totalClasses = Object.keys(attendance).length;
          const presentClasses = Object.values(attendance).filter(
            (entry) => entry.status === 1
          ).length;

          return {
            subjectName,
            totalClasses,
            presentClasses,
            attendancePercentage: Math.round((presentClasses / totalClasses) * 100),
          };
        });

        setSubjectsData(formattedData);
      } else {
        setError("No subjects found for the student.");
      }
    } catch (error) {
      setError("Failed to fetch data from Firebase. Please try again later.");
      console.error(error);
    }
  };

  return (
    <div className="student-subjects">
      <h1>My Subjects</h1>
      {error && <p className="error">{error}</p>}

      {/* Attendance Chart */}
      <div className="chart-container">
        <ResponsiveContainer width="95%" height={400}>
          <BarChart data={subjectsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subjectName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="presentClasses" fill="#82ca9d" name="Present" />
            <Bar dataKey="totalClasses" fill="#8884d8" name="Total Classes" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Attendance Table */}
      <div className="subjects-list">
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Total Classes</th>
              <th>Present</th>
              <th>Attendance (%)</th>
            </tr>
          </thead>
          <tbody>
            {subjectsData.map((subject) => (
              <tr
                key={subject.subjectName}
                className={subject.attendancePercentage < 75 ? "low-attendance" : ""}
                onClick={() =>
                  navigate("/student-login/dashboard/viewAttd/subj", {
                    state: {subjectCode: subject.subjectName },
                  })
                }
              >
                <td>{subject.subjectName}</td>
                <td>{subject.totalClasses}</td>
                <td>{subject.presentClasses}</td>
                <td>{subject.attendancePercentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentSubjects;


