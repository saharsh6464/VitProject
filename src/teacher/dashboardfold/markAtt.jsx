import React, { useState, useEffect, useContext } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import { dataContext } from "../../store/data";

const encodeKey = (key) => key.replace(/\./g, ",");
const decodeAttendanceCode = (code) => {
  const hour = code.slice(0, 2);
  const day = code.slice(2, 4);
  const month = code.slice(4, 6);
  const year = code.slice(6, 10);
  return `${day}/${month}/${year} at ${hour}`;
};

const TwoEmailTextInput = () => {
  const { personDetails } = useContext(dataContext);
  const teacherEmail = personDetails.email || "";

  const [studentEmail, setStudentEmail] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [attendanceCode, setAttendanceCode] = useState("");
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [hashCodes, setHashCodes] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase();
        const teacherRef = ref(db, `teachers/${encodeKey(teacherEmail)}`);
        const snapshot = await get(teacherRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const fetchedStudents = Object.keys(data.students || {});
          setStudents(fetchedStudents);

          const fetchedSubjects = data.subjects ? data.subjects.split(" ") : [];
          setSubjects(fetchedSubjects);
        } else {
          setError("No data found for the teacher.");
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      }
    };

    if (teacherEmail) {
      fetchData();
    }
  }, [teacherEmail]);

  useEffect(() => {
    const fetchHashCodes = async () => {
      if (studentEmail && subjectCode) {
        try {
          const db = getDatabase();
          const subjectRef = ref(
            db,
            `teachers/${encodeKey(teacherEmail)}/students/${encodeKey(studentEmail)}/subjects/${subjectCode}`
          );
          const snapshot = await get(subjectRef);

          if (snapshot.exists()) {
            const data = snapshot.val();
            const absentHashCodes = Object.keys(data || {}).filter(
              (key) => data[key].status === 0
            );
            setHashCodes(absentHashCodes);
          } else {
            setHashCodes([]);
          }
        } catch (err) {
          setError("Failed to fetch hash codes. Please try again.");
        }
      }
    };

    fetchHashCodes();
  }, [studentEmail, subjectCode, teacherEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentEmail || !subjectCode || !attendanceCode) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const db = getDatabase();
      const attendanceRef = ref(
        db,
        `teachers/${encodeKey(teacherEmail)}/students/${encodeKey(studentEmail)}/subjects/${subjectCode}/${attendanceCode}`
      );

      await update(attendanceRef, { status: 1 });

      const decodedTime = decodeAttendanceCode(attendanceCode);
      setSuccess(`Attendance marked successfully! Time: ${decodedTime}`);
      setError("");
    } catch (err) {
      setError("Failed to mark attendance. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Mark Attendance
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-sm mb-4 text-center">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="studentEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Student Email:
            </label>
            <select
              id="studentEmail"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a student</option>
              {students.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="subjectCode"
              className="block text-sm font-medium text-gray-700"
            >
              Subject Code:
            </label>
            <select
              id="subjectCode"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a subject</option>
              {subjects.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="attendanceCode"
              className="block text-sm font-medium text-gray-700"
            >
              Attendance Code:
            </label>
            <select
              id="attendanceCode"
              value={attendanceCode}
              onChange={(e) => setAttendanceCode(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a code</option>
              {hashCodes.map((code) => (
                <option key={code} value={code}>
                  {decodeAttendanceCode(code)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Mark Attendance
          </button>
        </form>
      </div>
    </div>
  );
};

export default TwoEmailTextInput;



// import React, { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getDatabase, get,set, update,ref } from "firebase/database";
// import { dataContext } from '../../store/data';
// import { useContext } from "react";
// import { database } from "../../store/firebase";
// const encodeEmail = (email) => email.replace('.', '_');
// import { markAttendance } from "../../store/utils";
// // const markAttendance = async (teacherEmail, studentEmail, subjectCode) => {
// //   // Encode email addresses for Firebase document paths
// //   const encodedTeacherEmail = encodeEmail(teacherEmail);
// //   const encodedStudentEmail = encodeEmail(studentEmail);

// //   // Reference to the specific subject attendance for the student
// //   const attendanceRef = ref(
// //     database,
// //     `teachers/${encodedTeacherEmail}/students/${encodedStudentEmail}/attendance/${subjectCode}`
// //   );

// //   try {
// //     // Fetch current attendance data for the subject
// //     const attendanceSnapshot = await get(attendanceRef);

// //     // Initialize or update attendance fields
// //     let updatedData = {
// //       numberOfClassesAttended: 1,
// //       totalClasses: 1,
// //     };

// //     if (attendanceSnapshot.exists()) {
// //       const currentData = attendanceSnapshot.val();
// //       updatedData = {
// //         numberOfClassesAttended: (currentData.numberOfClassesAttended || 0) + 1,
// //         totalClasses: (currentData.totalClasses || 0),
// //       };
// //     }

// //     // Use set() to overwrite or set the entire attendance data for the subject
// //     await set(attendanceRef, updatedData);

// //     console.log(
// //       `Attendance marked for ${studentEmail} in subject ${subjectCode} under ${teacherEmail}. 
// //       New attendance count: ${updatedData.numberOfClassesAttended}, Total classes: ${updatedData.totalClasses}`
// //     );
// //     return true;
// //   } catch (error) {
// //     console.error("Error updating attendance:", error);
// //     return false;
// //   }
// // };

// const TwoEmailTextInput = () => {
//   const { personDetails } = useContext(dataContext);
//   const email1 = personDetails.email;
//   const email2Ref = useRef(null);
//   const messageRef = useRef(null);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const navigate=useNavigate()

//   // Email validation function
//   const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const email2 = email2Ref.current.value;
//     const message = messageRef.current.value;

//     if (!isValidEmail(email1) || !isValidEmail(email2)) {
//       setError("Please enter valid email addresses.");
//       setSuccess("");
//       return;
//     }

//     if (!message) {
//       setError("Please enter a message.");
//       setSuccess("");
//       return;
//     }

//     // Handle form submission logic here
//     setError("");
//     setSuccess("Form submitted successfully!");
//     console.log("Email 1:", email1);
//     console.log("Email 2:", email2);
//     console.log("Message:", message);
//     markAttendance(email1,email2,message);
//     //navigate('/teacher-login/dashboard');
//     // Optionally clear the inputs after submission
//     email2Ref.current.value = "";
//     messageRef.current.value = "";
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
//       <h2>Submit Your Details</h2>
//       <form onSubmit={handleSubmit}>
//         {/* <div>
//           <label>Teacher Email Id</label>
//           <input type="email" ref={email1Ref} placeholder="Enter first email" required />
//         </div> */}
//         <div>
//           <label>Student email:</label>
//           <input type="email" ref={email2Ref} placeholder="Enter second email" required />
//         </div>
//         <div>
//           <label>Subject Code:</label>
//           <textarea ref={messageRef} placeholder="Enter your message" required />
//         </div>
//         {error && <p style={{ color: "red" }}>{error}</p>}
//         {success && <p style={{ color: "green" }}>{success}</p>}
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default TwoEmailTextInput;

// import React, { useState, useEffect, useContext } from "react";
//  import { getDatabase, get,set, update,ref } from "firebase/database";
// import { dataContext } from "../../store/data";  // Assuming this is the context for teacher data
// // import React, { useRef, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { getDatabase, get,set, update,ref } from "firebase/database";
// // import { dataContext } from '../../store/data';
// // import { useContext } from "react";

// // import { markAttendance } from "../../store/utils";
// const encodeKey = (key) => key.replace(/\./g, ",");

// const TwoEmailTextInput = () => {
//   const { personDetails } = useContext(dataContext);  // Teacher data context
//   const teacherEmail = personDetails?.email || "";
  
//   const [studentEmail, setStudentEmail] = useState("");
//   const [subjectCode, setSubjectCode] = useState("");
//   const [attendanceDate, setAttendanceDate] = useState("");
//   const [attendanceStatus, setAttendanceStatus] = useState("Present");
//   const [hours, setHours] = useState("09:00");  // Default hour selection
//   const [subjects, setSubjects] = useState([]);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Fetch available subjects for the teacher
//   useEffect(() => {
//     if (teacherEmail) {
//       const db = getDatabase();
//       const teacherRef = ref(db, `teachers/${encodeKey(teacherEmail)}/subjects`);

//       get(teacherRef).then((snapshot) => {
//         if (snapshot.exists()) {
//           setSubjects(Object.keys(snapshot.val()));  // Subjects under the teacher's name
//         } else {
//           setError("No subjects found for this teacher.");
//         }
//       });
//     }
//   }, [teacherEmail]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!studentEmail || !subjectCode || !attendanceDate || !hours) {
//       setError("Please fill in all the fields.");
//       return;
//     }

//     try {
//       // Preparing the data to save to Firebase
//       const db = getDatabase();
//       const attendanceRef = ref(
//         db,
//         `teachers/${encodeKey(teacherEmail)}/students/${encodeKey(studentEmail)}/subjects/${subjectCode}/${attendanceDate}/${hours}`
//       );

//       await set(attendanceRef, {
//         status: attendanceStatus === "Present" ? 1 : 0,
//       });

//       setSuccess("Attendance marked successfully!");
//       setError("");  // Clear error message if submission is successful
//     } catch (err) {
//       setError("Failed to mark attendance. Please try again.");
//       setSuccess("");  // Clear success message if error occurs
//     }
//   };

//   return (
//     <div className="attendance-form">
//       <h1>Mark Attendance</h1>
      
//       {error && <p className="error">{error}</p>}
//       {success && <p className="success">{success}</p>}

//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="studentEmail">Student Email:</label>
//           <input
//             type="email"
//             id="studentEmail"
//             value={studentEmail}
//             onChange={(e) => setStudentEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="subjectCode">Select Subject:</label>
//           <select
//             id="subjectCode"
//             value={subjectCode}
//             onChange={(e) => setSubjectCode(e.target.value)}
//             required
//           >
//             <option value="">--Select Subject--</option>
//             {subjects.map((subject) => (
//               <option key={subject} value={subject}>
//                 {subject}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label htmlFor="attendanceDate">Attendance Date:</label>
//           <input
//             type="date"
//             id="attendanceDate"
//             value={attendanceDate}
//             onChange={(e) => setAttendanceDate(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="hours">Select Hour:</label>
//           <input
//             type="time"
//             id="hours"
//             value={hours}
//             onChange={(e) => setHours(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Attendance Status:</label>
//           <div>
//             <label>
//               <input
//                 type="radio"
//                 name="attendanceStatus"
//                 value="Present"
//                 checked={attendanceStatus === "Present"}
//                 onChange={() => setAttendanceStatus("Present")}
//               />
//               Present
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="attendanceStatus"
//                 value="Absent"
//                 checked={attendanceStatus === "Absent"}
//                 onChange={() => setAttendanceStatus("Absent")}
//               />
//               Absent
//             </label>
//           </div>
//         </div>

//         <button type="submit">Mark Attendance</button>
//       </form>
//     </div>
//   );
// };

// export default TwoEmailTextInput;

// import React, { useState, useEffect, useContext } from "react";
// import { getDatabase, get, set, ref } from "firebase/database";
// import { dataContext } from "../../store/data"; // Assuming this is the context for teacher data

// const encodeKey = (key) => key.replace(/\./g, ",");

// const TwoEmailTextInput = () => {
//   const { personDetails } = useContext(dataContext);  // Teacher data context
//   const teacherEmail = personDetails?.email || "";

//   const [studentEmail, setStudentEmail] = useState("");
//   const [subjectCode, setSubjectCode] = useState("");
//   const [attendanceDate, setAttendanceDate] = useState("");  // Now the direct input of hashcode
//   const [attendanceStatus, setAttendanceStatus] = useState("Present");
//   const [hours, setHours] = useState("09:00");  // Default hour selection
//   const [subjects, setSubjects] = useState([]);  // To hold subjects (not used in manual mode)
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Fetch available subjects for the teacher
//   useEffect(() => {
//     if (teacherEmail) {
//       const db = getDatabase();
//       const teacherRef = ref(db, `teachers/${encodeKey(teacherEmail)}/subjects`);

//       get(teacherRef).then((snapshot) => {
//         if (snapshot.exists()) {
//           setSubjects(Object.keys(snapshot.val()));  // Subjects under the teacher's name
//         } else {
//           setError("No subjects found for this teacher.");
//         }
//       });
//     }
//   }, [teacherEmail]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!studentEmail || !subjectCode || !attendanceDate || !hours) {
//       setError("Please fill in all the fields.");
//       return;
//     }

//     try {
//       // Preparing the data to save to Firebase
//       const db = getDatabase();
//       const attendanceRef = ref(
//         db,
//         `teachers/${encodeKey(teacherEmail)}/students/${encodeKey(studentEmail)}/subjects/${subjectCode}/${attendanceDate}/${hours}`
//       );

//       await set(attendanceRef, {
//         status: attendanceStatus === "Present" ? 1 : 0,
//       });

//       setSuccess("Attendance marked successfully!");
//       setError("");  // Clear error message if submission is successful
//     } catch (err) {
//       setError("Failed to mark attendance. Please try again.");
//       setSuccess("");  // Clear success message if error occurs
//     }
//   };

//   return (
//     <div className="attendance-form">
//       <h1>Mark Attendance</h1>
      
//       {error && <p className="error">{error}</p>}
//       {success && <p className="success">{success}</p>}

//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="studentEmail">Student Email:</label>
//           <input
//             type="email"
//             id="studentEmail"
//             value={studentEmail}
//             onChange={(e) => setStudentEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="subjectCode">Subject Code (Manual Entry):</label>
//           <input
//             type="text"
//             id="subjectCode"
//             value={subjectCode}
//             onChange={(e) => setSubjectCode(e.target.value)}
//             placeholder="Enter subject code"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="attendanceDate">Attendance Date (Hashcode):</label>
//           <input
//             type="text"
//             id="attendanceDate"
//             value={attendanceDate}
//             onChange={(e) => setAttendanceDate(e.target.value)}
//             placeholder="Enter date hashcode (e.g., 20241124)"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="hours">Select Hour:</label>
//           <input
//             type="time"
//             id="hours"
//             value={hours}
//             onChange={(e) => setHours(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Attendance Status:</label>
//           <div>
//             <label>
//               <input
//                 type="radio"
//                 name="attendanceStatus"
//                 value="Present"
//                 checked={attendanceStatus === "Present"}
//                 onChange={() => setAttendanceStatus("Present")}
//               />
//               Present
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="attendanceStatus"
//                 value="Absent"
//                 checked={attendanceStatus === "Absent"}
//                 onChange={() => setAttendanceStatus("Absent")}
//               />
//               Absent
//             </label>
//           </div>
//         </div>

//         <button type="submit">Mark Attendance</button>
//       </form>
//     </div>
//   );
// };

// export default TwoEmailTextInput;
