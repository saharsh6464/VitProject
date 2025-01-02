import React, { useState, useEffect, useContext } from "react";
import { FaSignOutAlt, FaClipboardList, FaEye, FaUserCheck,FaFire } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { dataContext } from "../store/data";
import { getDatabase, ref, get } from "firebase/database";
import { Link } from "react-router-dom";
import { fetchStreaks } from "../store/gamification";
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
  const [isLightMode, setIsLightMode] = useState(true);
  const navigate = useNavigate();
  const [streaks, setStreaks] = useState(null);


  useEffect(() => {
    const fetchAndSetStreaks = async () => {
      if (personDetails && personDetails.name && personDetails.email) {
        const fetchedStreaks = await fetchStreaks(personDetails.name, personDetails.email);
        setStreaks(fetchedStreaks);
      }
    };
  
    fetchAndSetStreaks();
  }, [personDetails]);
  

  useEffect(() => {
    const fetchAndSetSubjects = async () => {
      if (personDetails && personDetails.name) {
        const subjects = await fetchSubjects(personDetails.name);
        setSubjectsArray(subjects);
      }
    };

    fetchAndSetSubjects();
  }, [personDetails]);

  const toggleTheme = () => {
    setIsLightMode((prevMode) => !prevMode);
  };

  const getAttendance = () => {
    navigate("/student-login/dashboard/get-Attendance");
  };

  const logout1 = () => {
    logout();
    navigate('/student-login');
  };

  const lead = () => {
    navigate("/student-login/dashboard/leaderboard");
  };

  return (
    <div
      className={`${
        isLightMode ? "bg-gray-100 text-gray-900" : "bg-gray-900 text-gray-100"
      } min-h-screen flex flex-col`}
    >
      {/* Header */}
      <header
        className={`${
          isLightMode
            ? "bg-gray-200 text-gray-800"
            : "bg-gray-800 text-gray-300"
        } shadow-md py-4 px-6 flex justify-between items-center flex-col md:flex-row`}
      >
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>
        <div className="flex flex-col md:flex-row gap-1 md:gap-4 items-center w-full md:w-auto">
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-4 py-2 w-full md:w-auto h-12 ${
              isLightMode
                ? "bg-gray-600 hover:bg-gray-500 text-white"
                : "bg-yellow-500 hover:bg-yellow-400 text-gray-900"
            } font-semibold rounded-md shadow transition transform hover:scale-105`}
          >
            {isLightMode ? "Dark Mode" : "Light Mode"}
          </button>
          <button
            onClick={lead}
            className={`flex items-center gap-2 px-4 py-2 w-full md:w-auto h-12 ${
              isLightMode
                ? "bg-gray-600 hover:bg-gray-500 text-white"
                : "bg-yellow-500 hover:bg-yellow-400 text-gray-900"
            } font-semibold rounded-md shadow transition transform hover:scale-105`}
          >
            LeaderBoard
          </button>
          <button
            onClick={logout1}
            className="flex items-center gap-2 px-4 py-2 w-full md:w-auto h-12 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-md shadow transition transform hover:scale-105"
          >
            <FaSignOutAlt />
            Logout
          </button>
          
          <div className={`${isLightMode ? "bg-gray-300 hover:bg-gray-200 text-green-800" : "bg-gray-700 hover:bg-gray-600 text-gray-300"} shadow-lg rounded-lg p-6 text-center transition transform hover:scale-105`}>
  {streaks ? (
    <div className="flex flex-wrap justify-center items-center">
      <FaFire className={`${isLightMode ? "text-yellow-500" : "text-yellow-400"} text-m mb-1 mx-auto`} />
      <p className="text-sm font-bold text-gray-800">Score: <span className="text-blue-500">{streaks.score}</span></p>
      <p className="text-sm font-bold text-gray-800">Current Streak: <span className="text-yellow-500">{streaks.currStreak}</span> 🔥</p>
      <p className="text-sm font-bold text-gray-800">Max Streak: <span className="text-green-500">{streaks.maxStreak}</span> 🥇</p>
      <p className="text-sm font-bold text-gray-800">Date: <span className="italic">{streaks.date}</span></p>
    </div>
  ) : (
    <p className="text-center text-gray-500 text-lg animate-pulse">Loading streaks...</p>
  )}
</div>


        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        {/* Interactive Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div
            onClick={getAttendance}
            className={`${
              isLightMode
                ? "bg-gray-300 hover:bg-gray-200 text-gray-800"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
            } shadow-lg rounded-lg p-6 text-center transition transform hover:scale-105 cursor-pointer`}
          >
            <FaUserCheck className="text-blue-500 text-4xl mb-4 mx-auto" />
            <h2 className="text-xl font-semibold">Take Attendance</h2>
          </div>
          <Link
            to={{ pathname: "/student-login/dashboard/viewAttd" }}
            state={{
              teacherEmail: personDetails?.name,
              studentEmail: personDetails?.email,
            }}
            className={`${
              isLightMode
                ? "bg-gray-300 hover:bg-gray-200 text-green-800"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
            } shadow-lg rounded-lg p-6 text-center transition transform hover:scale-105`}
          >
            <FaEye
              className={`${
                isLightMode ? "text-green-800" : "text-green-400"
              } text-4xl mb-4 mx-auto`}
            />
            <h2 className="text-xl font-semibold">View Attendance</h2>
          </Link>
        </div>

        {/* Classes Taken Table */}
        <div className="mb-8">
          <h3
            className={`${
              isLightMode ? "text-gray-700 bg-gray-300" : "text-blue-600 bg-blue-100"
            } text-xl font-semibold mb-4 p-4 pl-8 pr-8 rounded-md inline-block`}
          >
            Classes Taken by You This Semester
          </h3>

          <table
            className={`w-full text-left border-collapse ${
              isLightMode
                ? "bg-gray-200 text-gray-900"
                : "bg-gray-800 text-gray-300"
            } shadow-lg rounded-lg overflow-hidden`}
          >
            <thead>
              <tr
                className={`${
                  isLightMode ? "bg-blue-400 text-gray-900" : "bg-gray-700 text-gray-300"
                }`}
              >
                <th className="px-4 py-2">Subject Name</th>
              </tr>
            </thead>
            <tbody>
              {subjectsArray.length > 0 ? (
                subjectsArray.map((subject, index) => (
                  <tr
                    key={index}
                    className={`${
                      isLightMode
                        ? "border-t border-gray-400"
                        : "border-t border-gray-700"
                    }`}
                  >
                    <td className="px-4 py-2">{subject.name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="1" className="px-4 py-2 text-center">
                    No classes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`${
          isLightMode ? "bg-gray-200 text-gray-800" : "bg-gray-800 text-gray-400"
        } py-6 text-center`}
      >
        <p>&copy; 2024 Your College. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default DashboardS;





// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { dataContext } from "../store/data";
// import { Link } from "react-router-dom";
// import { getDatabase, ref, get } from "firebase/database"; // Ensure these imports are valid
// import "./dashboard.css";
// import { logout } from "../store/saveCredS";
// const encodeKey = (key) => key.replace(/\./g, ",");

// const fetchSubjects = async (teacherEmail) => {
//   try {
//     const encodedEmail = encodeKey(teacherEmail);
//     const db = getDatabase();
//     const teacherRef = ref(db, `teachers/${encodedEmail}/subjects`);

//     const snapshot = await get(teacherRef);
//     if (snapshot.exists()) {
//       const subjectsString = snapshot.val(); // Example: "math science english"
//       console.log(subjectsString);
//       return subjectsString.split(" ").map((subject) => ({
//         name: subject.charAt(0).toUpperCase() + subject.slice(1), // Capitalize first letter
//       }));
//     }
//     return [];
//   } catch (error) {
//     console.error("Error fetching subjects:", error);
//     return [];
//   }
// };

// function DashboardS() {
//   const { personDetails } = useContext(dataContext);
//   const [subjectsArray, setSubjectsArray] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchAndSetSubjects = async () => {
//       if (personDetails && personDetails.name) {
//         const subjects = await fetchSubjects(personDetails.name);
//         console.log(subjects);
//         setSubjectsArray(subjects);
//       }
//     };

//     fetchAndSetSubjects();
//   }, [personDetails]);

//   const getAttendance = () => {
//     navigate("/student-login/dashboard/get-Attendance");
//   };

//   return (
//     <div className="container">
//       <div className="main-content">
//         {/* Header */}
//         <header className="header">
//           <h2>Dashboard</h2>
//           <div className="user">{personDetails?.email || "User"}</div>
//         </header>

//         {/* Action Buttons */}
//         <div className="actions">
//           <div onClick={getAttendance} className="action-box take-attendance">
//             Take Attendance
//           </div>
//           <Link
//             className="action-box view-attendance"
//             to={{
//               pathname: "/student-login/dashboard/viewAttd",
//             }}
//             state={{
//               teacherEmail: personDetails?.name,
//               studentEmail: personDetails?.email,
//             }}
//           >
//             View Attendance
//           </Link>
//           <Link
//             onClick={logout}
//             className="action-box view-attendance"
//             to={{
//               pathname: "/student-login",
//             }}
//           >
//             logout
//           </Link>
//         </div>

//         {/* Class Table */}
//         <div className="class-table">
//           <div className="table-header">Classes Taken by You this Semester</div>
//           <table>
//             <thead>
//               <tr>
//                 <th>Subject Name</th>
//               </tr>
//             </thead>
//             <tbody>
//               {subjectsArray.length > 0 ? (
//                 subjectsArray.map((subject, index) => (
//                   <tr key={index}>
//                     <td>{subject.name}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="1">No classes found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer id="footer">
//         <p>
//           No 50, Koorgalli Village, Hootagalli Industrial Area, next to BEML,
//           Mysuru, Karnataka 570018
//         </p>
//         <p>&copy; 2024 All Rights Reserved</p>
//       </footer>
//     </div>
//   );
// }

// export default DashboardS;



// import React from "react";
// import "./dashboard.css";
// import { useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { dataContext } from "../store/data";
// import { Link } from "react-router-dom";
// import StudentAttendanceDashboard from "./subData";
// function DashboardS() {
//   const { personDetails } = useContext(dataContext);
//   const subjectsArray = [
//     { code: "AIML", name: "Artificial Intelligence" },
//     { code: "CSE", name: "Computer Science Engineering" },
//     { code: "DDCO", name: "Digital Design" },
//     { code: "DSC", name: "Data Structures in C" },
//     { code: "MATHS", name: "Mathematics" },
//   ];
//   console.log("data");
//   console.log(personDetails);

//   const navigate = useNavigate();
//   const getAttendance = () => {
//     navigate("/student-login/dashboard/get-Attendance");
//   };
//   const teacherEmail = personDetails.name;
//   const studentEmail = personDetails.email;
//   return (
//     <div className="container">
//       {/* Sidebar */}
//       {/* <nav className="sidebar">
//         <h2 className="logo">Attendance MS</h2>
//         <ul>
//           <li>Dashboard</li>
//           <li>My Classes</li>
//           <li>Take Attendance</li>
//           <li>View Attendance</li>
//         </ul>
//       </nav> */}

//       {/* Main Content */}
//       <div className="main-content">
//         {/* Header */}
//         <header className="header">
//           <h2>Dashboard</h2>
//           <div className="user">Sourav Das</div>
//         </header>

//         {/* Action Buttons */}
//         <div className="actions">
//           <div onClick={getAttendance} className="action-box take-attendance">
//             Take Attendance
//           </div>
//           <Link className="action-box view-attendance"
//             to={{
//               pathname: "/student-login/dashboard/viewAttd",
//             }}
//             state={{ teacherEmail, studentEmail }}
//           >
//             View Attendance
//           </Link>
//         </div>

//         {/* Class Table */}
//         <div className="class-table">
//           <div className="table-header">Classes Taken by You this Semester</div>
//           <table>
//             <thead>
//               <tr>
//                 <th>Subject Code</th>
//                 <th>Subject Name</th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* <tr>
//                 <td></td>
//                 <td>Management & Accounting</td>
//                 <td>7</td>
//               </tr>
//               <tr>
//                 <td>BBA501</td>
//                 <td>Financial Management - II</td>
//                 <td>4</td>
//               </tr>
//               <tr>
//                 <td>BBA502</td>
//                 <td>Marketing Management - II</td>
//                 <td>11</td>
//               </tr>
//               <tr>
//                 <td>BBA503</td>
//                 <td>Human Resource Management</td>
//                 <td>10</td>
//               </tr>
//               <tr>
//                 <td>BBA504</td>
//                 <td>Fundamentals of Entrepreneurship</td>
//                 <td>7</td>
//               </tr> */}
//               {subjectsArray.map((subject, index) => (
//                 <tr key={index}>
//                   <td>{subject.code}</td>
//                   <td>{subject.name}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer id="footer">
//         <p>
//           No 50, Koorgalli Village, Hootagalli Industrial Area, next to BEML,
//           Mysuru, Karnataka 570018
//         </p>
//         <p>&copy; 2024 All Rights Reserved</p>
//       </footer>
//     </div>
//   );
// }

// export default DashboardS;
