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
import { dataContext } from "../../store/data";

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
      return snapshot.val().name;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching student name:", error);
    return null;
  }
};

const StudentDetails = () => {
  const { personDetails } = useContext(dataContext);
  const location = useLocation();
  const { studentEmail, subjectName } = location.state;

  const [studentName, setStudentName] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      const name = await getStudentName(personDetails.email, studentEmail);
      if (name) {
        setStudentName(name);
        fetchStudentDetails();
      } else {
        setError("Student not found.");
      }
    };

    fetchDetails();
  }, [studentEmail, subjectName, personDetails]);

  const fetchStudentDetails = async () => {
    if (!personDetails?.email) {
      setError("Teacher information is missing.");
      return;
    }

    setError("");
    const db = getDatabase();
    const studentRef = ref(
      db,
      `teachers/${encodeKey(personDetails.email)}/students/${encodeKey(
        studentEmail
      )}/subjects/${subjectName}`
    );

    try {
      const snapshot = await get(studentRef);
      if (snapshot.exists()) {
        const subjectData = snapshot.val();
        const formattedData = Object.entries(subjectData).map(
          ([id, details]) => ({
            date: details.date,
            status: details.status === 1 ? "Present" : "Absent",
          })
        );
        setAttendanceData(formattedData);

        let totalClasses = 0;
        let presentClasses = 0;

        const chartFormattedData = formattedData.map((entry) => {
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

        setChartData(chartFormattedData);
      } else {
        setError("Student or subject not found.");
      }
    } catch (error) {
      setError("Failed to fetch data from Firebase.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Attendance Details for {studentName}
        </h1>
        <h3 className="text-lg text-gray-600 mb-6">Subject: {subjectName}</h3>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-8">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 12, fill: "#333" }}
                dy={10}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12, fill: "#333" }}
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

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((entry, index) => (
                <tr
                  key={index}
                  className={
                    entry.status === "Present"
                      ? "bg-green-50"
                      : "bg-red-50"
                  }
                >
                  <td className="px-6 py-4 text-sm text-gray-800 border-b">
                    {entry.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 border-b">
                    {entry.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;

