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

const encodeKey = (key) => key.replace(/\./g, ",");

const getStudentName = async (teacherEmail, studentEmail) => {
  const db = getDatabase();
  const studentRef = ref(
    db,
    `teachers/${encodeKey(teacherEmail)}/students/${encodeKey(studentEmail)}`
  );

  try {
    const snapshot = await get(studentRef);
    if (snapshot.exists()) {
      return snapshot.val()?.name || "Unknown Student";
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
  const { personDetails } = useContext(dataContext);
  const teacherEmail = personDetails?.name || "";
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

      const fetchedStudentName = await getStudentName(
        teacherEmail,
        studentEmail
      );
      if (fetchedStudentName) {
        setStudentName(fetchedStudentName);
        await fetchAttendanceData();
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Attendance Details for {studentName}</h1>
        <h3 className="text-xl font-medium mb-4 text-center">Subject: {subjectCode}</h3>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {attendanceDetails.length > 0 ? (
          <>
            <div className="chart-container mb-8">
              <ResponsiveContainer width="100%" height={400}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {attendanceDetails.map((entry) => (
                <div
                  key={entry.date}
                  className={`p-4 rounded-md shadow-md ${
                    entry.status === "Present"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <p className="font-medium">Date: {entry.date}</p>
                  <p className="font-medium">Status: {entry.status}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center">No attendance records available.</p>
        )}
      </div>
    </div>
  );
};

export default StudentSubjectDetails;
