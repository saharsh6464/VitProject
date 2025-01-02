import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import emailjs from "emailjs-com"; // Import EmailJS

const encodeKey = (key) => key.replace(/\./g, ",");

const SubjectData = () => {
  const location = useLocation();
  const { teacherEmail, subjectName } = location.state;

  const [studentsData, setStudentsData] = useState([]);
  const [error, setError] = useState("");
  const [notifyLoading, setNotifyLoading] = useState(false);

  useEffect(() => {
    fetchAttendanceData();
  }, [teacherEmail, subjectName]);

  const fetchAttendanceData = async () => {
    setError("");
    const db = getDatabase();
    const teacherRef = ref(db, `teachers/${encodeKey(teacherEmail)}`);

    try {
      const snapshot = await get(teacherRef);
      if (snapshot.exists()) {
        const teacherData = snapshot.val();
        const students = teacherData.students;

        const attendanceData = Object.entries(students)
          .map(([encodedEmail, studentInfo]) => {
            const subjectAttendance = studentInfo.subjects[subjectName];
            if (!subjectAttendance) return null;

            const totalClasses = Object.keys(subjectAttendance).length;
            const presentClasses = Object.values(subjectAttendance).filter(
              (entry) => entry.status === 1
            ).length;

            return {
              email: encodedEmail.replace(/,/g, "."),
              name: studentInfo.name,
              totalClasses,
              presentClasses,
              attendancePercentage: Math.round((presentClasses / totalClasses) * 100),
            };
          })
          .filter(Boolean);

        setStudentsData(attendanceData);
      } else {
        setError("Teacher or subject not found.");
      }
    } catch (error) {
      setError("Failed to fetch data from Firebase.");
    }
  };

  const handleNotify = async () => {
    setNotifyLoading(true);

    const lowAttendanceStudents = studentsData.filter(
      (student) => student.attendancePercentage < 75
    );

    const promises = lowAttendanceStudents.map((student) => {
      const message = `Hello ${student.name},\n\nYour attendance is ${student.attendancePercentage}% in ${subjectName}. Please ensure to improve your attendance.\n\nBest regards,\nYour Teacher`;
      return emailjs.send(
        "service_eav177o", // Replace with your EmailJS service ID
        "template_v46m6nf", // Replace with your EmailJS template ID
        {
          to_name: student.name, // Student's name
          to_email: student.email, // Student's email
          attendance_percentage: student.attendancePercentage, // Dynamic attendance percentage
          subject_name: subjectName, // Subject name
          message: `Hello ${student.name}, Your attendance is ${student.attendancePercentage}% in ${subjectName}.`,
        },
        "QpTGpMUoNFLqrj_xX" // Replace with your EmailJS user ID
      );
    });

    try {
      await Promise.all(promises);
      alert("Notification emails sent successfully!");
    } catch (error) {
      console.error("Error sending emails:", error);
      alert("Failed to send some or all notifications.");
    } finally {
      setNotifyLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Attendance for {subjectName}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        className={`mb-6 px-6 py-2 rounded-md text-white font-semibold ${notifyLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        onClick={handleNotify}
        disabled={notifyLoading}
      >
        {notifyLoading ? "Sending Notifications..." : "Notify Low Attendance Students"}
      </button>

      <div className="shadow-lg p-4 rounded-md bg-white mb-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={studentsData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="presentClasses" fill="#82ca9d" name="Present" />
            <Bar dataKey="totalClasses" fill="#8884d8" name="Total Classes" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-md">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-gray-700">Student Name</th>
              <th className="px-4 py-2 text-gray-700">Total Classes</th>
              <th className="px-4 py-2 text-gray-700">Present</th>
              <th className="px-4 py-2 text-gray-700">Attendance (%)</th>
            </tr>
          </thead>
          <tbody>
            {studentsData.map((student) => (
              <tr
                key={student.email}
                className={`hover:bg-gray-100 ${
                  student.attendancePercentage < 75 ? "bg-red-100" : "bg-green-100"
                }`}
              >
                <td className="px-4 py-2">
                  <Link
                    to={{
                      pathname: "/teacher-login/dashboard/subjectData/student",
                    }}
                    state={{ studentEmail: student.email, subjectName }}
                    className="text-blue-600 hover:underline"
                  >
                    {student.name}
                  </Link>
                </td>
                <td className="px-4 py-2">{student.totalClasses}</td>
                <td className="px-4 py-2">{student.presentClasses}</td>
                <td className="px-4 py-2">{student.attendancePercentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectData;




// import React, { useEffect, useState } from "react";
// import { useLocation, Link } from "react-router-dom";
// import { getDatabase, ref, get } from "firebase/database";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import "./SubData.css";

// const encodeKey = (key) => key.replace(/\./g, ",");

// const SubjectData = () => {
//   const location = useLocation();
//   const { teacherEmail, subjectName } = location.state;

//   const [studentsData, setStudentsData] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchAttendanceData();
//   }, [teacherEmail, subjectName]);

//   const fetchAttendanceData = async () => {
//     setError("");
//     const db = getDatabase();
//     const teacherRef = ref(db, `teachers/${encodeKey(teacherEmail)}`);

//     try {
//       const snapshot = await get(teacherRef);
//       if (snapshot.exists()) {
//         const teacherData = snapshot.val();
//         const students = teacherData.students;

//         const attendanceData = Object.entries(students)
//           .map(([encodedEmail, studentInfo]) => {
//             const subjectAttendance = studentInfo.subjects[subjectName];
//             if (!subjectAttendance) return null;

//             const totalClasses = Object.keys(subjectAttendance).length;
//             const presentClasses = Object.values(subjectAttendance).filter(
//               (entry) => entry.status === 1
//             ).length;

//             return {
//               email: encodedEmail.replace(/,/g, "."),
//               name: studentInfo.name,
//               totalClasses,
//               presentClasses,
//               attendancePercentage: Math.round((presentClasses / totalClasses) * 100),
//             };
//           })
//           .filter(Boolean);

//         setStudentsData(attendanceData);
//       } else {
//         setError("Teacher or subject not found.");
//       }
//     } catch (error) {
//       setError("Failed to fetch data from Firebase.");
//     }
//   };

//   return (
//     <div className="subject-data">
//       <h1>Attendance for {subjectName}</h1>
//       {error && <p className="error">{error}</p>}

//       {/* Responsive Bar Chart */}
//       <div className="chart-container">
//         <ResponsiveContainer width="95%" height={400}>
//           <BarChart
//             data={studentsData}
//             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="presentClasses" fill="#82ca9d" name="Present" />
//             <Bar dataKey="totalClasses" fill="#8884d8" name="Total Classes" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Responsive Attendance Table */}
//       <div className="table-container">
//         <table>
//           <thead>
//             <tr>
//               <th>Student Name</th>
//               <th>Email</th>
//               <th>Total Classes</th>
//               <th>Present</th>
//               <th>Attendance (%)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {studentsData.map((student) => (
//               <tr
//                 key={student.email}
//                 className={student.attendancePercentage < 75 ? "low-attendance" : ""}
//               >
//                 <td>
//                   <Link
//                     to={{
//                       pathname: "/teacher-login/dashboard/subjectData/student",
//                     }}
//                     state={{ studentEmail: student.email, subjectName }}
//                   >
//                     {student.name}
//                   </Link>
//                 </td>
//                 <td>{student.email}</td>
//                 <td>{student.totalClasses}</td>
//                 <td>{student.presentClasses}</td>
//                 <td>{student.attendancePercentage}%</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default SubjectData;



// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { getDatabase, ref, get } from "firebase/database";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// const AttendanceDashboard = () => {
//   const location = useLocation();
//   const { teacherEmail, subjectCode } = location.state || {}; // Retrieve state data
//   const [studentsData, setStudentsData] = useState([]);
//   const database = getDatabase();

//   useEffect(() => {
//     if (!teacherEmail || !subjectCode) return;

//     const fetchStudentData = async () => {
//       const safeTeacherEmail = teacherEmail.replace(".", "_");
//       const studentsRef = ref(database, `teachers/${safeTeacherEmail}/students`);
//       const snapshot = await get(studentsRef);

//       if (snapshot.exists()) {
//         const students = snapshot.val();
//         const attendanceData = Object.keys(students).map((studentEmail) => {
//           const student = students[studentEmail];
//           const attendance = student.attendance?.[subjectCode];
//           const attendancePercentage = attendance
//             ? (attendance.numberOfClassesAttended / attendance.totalClasses) * 100
//             : 0;

//           return {
//             email: studentEmail.replace("_", "."),
//             name: student.name,
//             numberOfClassesAttended: attendance?.numberOfClassesAttended || 0,
//             totalClasses: attendance?.totalClasses || 0,
//             attendancePercentage,
//           };
//         });
//         setStudentsData(attendanceData);
//       }
//     };

//     fetchStudentData();
//   }, [database, teacherEmail, subjectCode]);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Attendance Dashboard</h2>
//       <h3>Subject: {subjectCode}</h3>

//       <table style={{ width: "100%", marginBottom: "20px" }}>
//         <thead>
//           <tr>
//             <th>Email</th>
//             <th>Name</th>
//             <th>Classes Attended</th>
//             <th>Total Classes</th>
//             <th>Attendance %</th>
//           </tr>
//         </thead>
//         <tbody>
//           {studentsData.map((student) => (
//             <tr
//               key={student.email}
//               style={{ backgroundColor: student.attendancePercentage < 75 ? "#ffcccc" : "white" }}
//             >
//               <td>{student.email}</td>
//               <td>{student.name}</td>
//               <td>{student.numberOfClassesAttended}</td>
//               <td>{student.totalClasses}</td>
//               <td>{student.attendancePercentage.toFixed(1)}%</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <h3>Attendance Visualization</h3>
//       <ResponsiveContainer width="100%" height={400}>
//         <BarChart data={studentsData}>
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="attendancePercentage" fill="#8884d8" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default AttendanceDashboard;