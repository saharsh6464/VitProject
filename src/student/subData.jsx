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

const encodeKey = (key) => key.replace(/\./g, ",");

const StudentSubjects = () => {
  const [subjectsData, setSubjectsData] = useState([]);
  const [error, setError] = useState("");
  const { personDetails } = useContext(dataContext); // Logged-in student email
  const studentEmail = personDetails.email;
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
    const studentRef = ref(
      db,
      `teachers/${encodeKey(teacherEmail)}/students/${encodeKey(studentEmail)}/subjects`
    );

    try {
      const snapshot = await get(studentRef);
      if (snapshot.exists()) {
        const subjects = snapshot.val();

        // Format attendance data
        const formattedData = Object.entries(subjects).map(
          ([subjectName, attendance]) => {
            const totalClasses = Object.keys(attendance).length;
            const presentClasses = Object.values(attendance).filter(
              (entry) => entry.status === 1
            ).length;

            return {
              subjectName,
              totalClasses,
              presentClasses,
              attendancePercentage: Math.round(
                (presentClasses / totalClasses) * 100
              ),
            };
          }
        );

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
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">My Subjects</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {/* Attendance Chart */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Attendance Chart</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={subjectsData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
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
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Attendance Details</h2>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2 text-left">Subject</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Total Classes</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Present</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Attendance (%)</th>
            </tr>
          </thead>
          <tbody>
            {subjectsData.map((subject) => (
              <tr
                key={subject.subjectName}
                className={`${
                  subject.attendancePercentage < 75
                    ? "bg-red-100"
                    : "bg-green-100"
                } hover:bg-gray-200 cursor-pointer`}
                onClick={() =>
                  navigate("/student-login/dashboard/viewAttd/subj", {
                    state: { subjectCode: subject.subjectName },
                  })
                }
              >
                <td className="border border-gray-200 px-4 py-2">{subject.subjectName}</td>
                <td className="border border-gray-200 px-4 py-2">{subject.totalClasses}</td>
                <td className="border border-gray-200 px-4 py-2">{subject.presentClasses}</td>
                <td className="border border-gray-200 px-4 py-2">{subject.attendancePercentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentSubjects;
