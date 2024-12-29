import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { dataContext } from "../store/data";
import "./studSub.css"; // Ensure this file contains the required CSS

// Helper function to encode Firebase keys
const encodeKey = (key) => key.replace(/\./g, ",");

// Helper function to fetch student name
const getStudentName = async (teacherEmail, studentEmail) => {
  const db = getDatabase();
  const studentRef = ref(
    db,
    `teachers/${encodeKey(teacherEmail)}/students/${encodeKey(studentEmail)}`
  );

  try {
    const snapshot = await get(studentRef);
    if (snapshot.exists()) {
      return snapshot.val()?.name || "Unknown Student"; // Assume 'name' exists
    }
    return null;
  } catch (error) {
    console.error("Error fetching student name:", error);
    return null;
  }
};

const StudentSubjectDetails = () => {
  const location = useLocation();
  const { subjectCode } = location.state || {};
  const { personDetails } = useContext(dataContext); // Fetch teacher info from context
  const teacherEmail = personDetails?.name || ""; // Ensure email is defined
  const studentEmail = personDetails?.email || "";
  const [studentName, setStudentName] = useState("");
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      if (!teacherEmail || !subjectCode || !studentEmail) {
        setError("Missing teacher, student, or subject details.");
        return;
      }

      // Fetch student name
      const fetchedStudentName = await getStudentName(
        teacherEmail,
        studentEmail
      );
      if (fetchedStudentName) {
        setStudentName(fetchedStudentName);
        await fetchAttendanceData(); // Fetch attendance data
      } else {
        setError("Failed to fetch student details.");
      }
    };

    fetchDetails();
  }, [teacherEmail, studentEmail, subjectCode]);

  const fetchAttendanceData = async () => {
    const db = getDatabase();
    const attendanceRef = ref(
      db,
      `teachers/${encodeKey(teacherEmail)}/students/${encodeKey(
        studentEmail
      )}/subjects/${subjectCode}`
    );

    try {
      const snapshot = await get(attendanceRef);
      if (snapshot.exists()) {
        const attendanceData = snapshot.val();

        const details = Object.entries(attendanceData).map(([key, value]) => ({
          date: value.date,
          status: value.status === 1 ? "Present" : "Absent",
        }));

        setAttendanceDetails(details);

        // Prepare data for chart
        let totalClasses = 0;
        let presentClasses = 0;
        const formattedChartData = details.map((entry) => {
          totalClasses++;
          if (entry.status === "Present") presentClasses++;
          return {
            date: entry.date,
            attendancePercentage: (
              (presentClasses / totalClasses) *
              100
            ).toFixed(2),
          };
        });

        setChartData(formattedChartData);
      } else {
        setError("No attendance data available.");
      }
    } catch (err) {
      setError("Failed to retrieve attendance data.");
      console.error(err);
    }
  };

  return (
    <div className="student-details">
      <h1>Attendance Details for {studentName}</h1>
      <h3>Subject: {subjectCode}</h3>
      {error && <p className="error">{error}</p>}

      {attendanceDetails.length > 0 ? (
        <>
          {/* Line Chart */}
          <div className="chart-container">
            <ResponsiveContainer width="95%" height={400}>
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line
                  type="monotone"
                  dataKey="attendancePercentage"
                  stroke="#4caf50"
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Attendance Cards */}
          <div className="attendance-list">
            {attendanceDetails.map((entry) => (
              <div
                key={entry.date}
                className={`attendance-card ${
                  entry.status === "Present" ? "present-card" : "absent-card"
                }`}
              >
                <p className="attendance-date">{entry.date}</p>
                <p className="attendance-status">{entry.status}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="no-data">No attendance records available.</p>
      )}
    </div>
  );
};

export default StudentSubjectDetails;
