import React, { useState, useEffect, useContext } from "react";
import { FaSignOutAlt, FaClipboardList, FaEye, FaUserCheck } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { dataContext } from "../../store/data";
import { getDatabase, ref, get } from "firebase/database";
import { logoutTeacher } from "../../store/saveCredT";
import "../../tailwind.css"
import DownloadSheet from "./download";

const encodeKey = (key) => key.replace(/\./g, ",");

const totalNoOfClasses = async (subjectName, teacherEmail) => {
  try {
    const encodedTeacherEmail = encodeKey(teacherEmail);
    const db = getDatabase();
    const teacherRef = ref(db, `teachers/${encodedTeacherEmail}`);

    const snapshot = await get(teacherRef);
    const teacherData = snapshot.val();

    if (teacherData && teacherData.students) {
      const firstStudentEmail = Object.keys(teacherData.students)[0];
      const student = teacherData.students[firstStudentEmail];
      const subjectDetails = student.subjects[subjectName];
      let totalClasses = 0;

      for (const classId in subjectDetails) {
        totalClasses++;
      }

      return totalClasses;
    }
    return 0;
  } catch (error) {
    console.error("Error fetching teacher data: ", error);
    return 0;
  }
};

const fetchSubjects = async (teacherEmail) => {
  try {
    const encodedEmail = encodeKey(teacherEmail);
    const db = getDatabase();
    const teacherRef = ref(db, `teachers/${encodedEmail}/subjects`);

    const snapshot = await get(teacherRef);
    if (snapshot.exists()) {
      const subjectsString = snapshot.val();
      return subjectsString.split(" ").map((subject) => ({
        name: subject.charAt(0).toUpperCase() + subject.slice(1),
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
};

const DashboardT = () => {
  const { personDetails, takeAttendance12 } = useContext(dataContext);
  const [subjects, setSubjects] = useState([]);
  const [isLightMode, setIsLightMode] = useState(true);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsLightMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    const loadSubjectsAndClasses = async () => {
      try {
        const fetchedSubjects = await fetchSubjects(personDetails.email);
        const updatedSubjects = await Promise.all(
          fetchedSubjects.map(async (subject) => {
            const totalClasses = await totalNoOfClasses(subject.name, personDetails.email);
            return { ...subject, classes: totalClasses };
          })
        );
        setSubjects(updatedSubjects);
      } catch (error) {
        console.error("Error loading subjects and classes:", error);
      }
    };

    loadSubjectsAndClasses();
  }, [personDetails.email]);

  const openModal = () => {
    navigate("/teacher-login/dashboard/register");
  };

  const openModal1 = () => {
    navigate("/teacher-login/dashboard/mannual");
  };

  const takeAttendance = (subjectName) => {
    navigate("/teacher-login/dashboard/QR", { state: subjectName });
  };

  const logout = () => {
    logoutTeacher();
    navigate('/teacher-login');
  }

  const handleLead = () => {
    navigate("/teacher-login/dashboard/leaderboard");
  }

  return (
    <div className={`${isLightMode ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100'} min-h-screen flex flex-col`}>
      <header className={`${isLightMode ? 'bg-gray-200 text-gray-800' : 'bg-gray-800 text-gray-300'} shadow-md py-4 px-6 flex justify-between items-center`}>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-md shadow ${isLightMode ? 'bg-gray-600 text-white' : 'bg-yellow-500 text-gray-900'} transition transform hover:scale-105`}
          >
            {isLightMode ? 'Dark Mode' : 'Light Mode'}
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-md shadow transition transform hover:scale-105 flex items-center gap-2"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div
            className={`${isLightMode ? 'bg-gray-300 hover:bg-gray-200 text-gray-800' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'} shadow-lg rounded-lg p-6 text-center transition transform hover:scale-105`}
            onClick={openModal}
          >
            <FaUserCheck className="text-blue-500 text-4xl mb-4 mx-auto" />
            <h2 className="text-xl font-semibold">Register Student</h2>
          </div>
          <div
            
            className={`${isLightMode ? 'bg-gray-300 hover:bg-gray-200 text-gray-800' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'} shadow-lg rounded-lg p-6 text-center transition transform hover:scale-105`}
            onClick={handleLead}
          >
            <FaUserCheck className="text-blue-500 text-4xl mb-4 mx-auto" />
            <h2 className="text-xl font-semibold">Leaderboard</h2>
          </div>
          <div
            className={`${isLightMode ? 'bg-gray-300 hover:bg-gray-200 text-green-800' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'} shadow-lg rounded-lg p-6 text-center transition transform hover:scale-105`}
            onClick={openModal1}
          >
            <FaEye className="text-4xl mb-4 mx-auto" />
            <h2 className="text-xl font-semibold">Manual Attendance</h2>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Classes Taken This Semester</h3>
        <table className={`w-full border-collapse ${isLightMode ? 'bg-gray-200 text-gray-900' : 'bg-gray-800 text-gray-300'} shadow-lg rounded-lg overflow-hidden`}>
          <thead>
            <tr className={`${isLightMode ? 'bg-blue-400 text-gray-900' : 'bg-gray-700 text-gray-300'}`}>
              <th className="px-4 py-2">Subject Name</th>
              <th className="px-4 py-2">My Classes</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, index) => (
              <tr key={index} className={`${isLightMode ? 'border-t border-gray-400' : 'border-t border-gray-700'}`}>
                <td className="px-4 py-2">
                  <Link
                    to="/teacher-login/dashboard/subjectData"
                    state={{
                      teacherEmail: personDetails.email,
                      subjectName: subject.name,
                    }}
                  >
                    {subject.name}
                  </Link>
                </td>
                <td className="px-4 py-2">{subject.classes || "No Data"}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      takeAttendance12(new Date(), subject.name);
                      takeAttendance(subject.name);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md transition transform hover:scale-105"
                  >
                    Take Attendance
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <span>
      <DownloadSheet />
      </span>
      
      <footer className={`${isLightMode ? 'bg-gray-200 text-gray-800' : 'bg-gray-800 text-gray-400'} py-6 text-center`}>
        <p>&copy; 2024 Your College. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default DashboardT;
