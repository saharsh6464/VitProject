
import { ref, set } from "firebase/database";
import { database } from "./firebase";
import sha256 from "js-sha256";
import { getDatabase, get, update } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

// Utility function to encode email
export const encodeEmail = (email) => email.replace(/\./g, ",");
const encodeKey = (key) => key.replace(/\./g, ",");

// Function to mark attendance
export const markAttendance = async (teacherEmail, studentEmail, subjectCode, inputDate) => {
    const encodedTeacherEmail = encodeEmail(teacherEmail);
    const encodedStudentEmail = encodeEmail(studentEmail);

    // Convert inputDate string to a Date object
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) {
        console.error("Invalid date format provided:", inputDate);
        return false;
    }

    // Extract hour, day, month, and year
    const hours = date.getHours().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear().toString();

    // Create a unique attendance code based on the date and hour
    const attendanceCode = `${hours}${day}${month}${year}`;

    // Reference path in Firebase
    const attendanceRef = ref(
        database,
        `teachers/${encodedTeacherEmail}/students/${encodedStudentEmail}/subjects/${subjectCode}/${attendanceCode}`
    );

    try {
        const attendanceSnapshot = await get(attendanceRef);
        const updatedData = {
            date: `${day}/${month}/${year}`,
            status: 1, // Present
        };

        if (attendanceSnapshot.exists()) {
            await set(attendanceRef, updatedData);
            console.log(`Attendance marked for ${studentEmail} on ${day}/${month}/${year}.`);

        } else {
            console.warn(`Attendance for code ${attendanceCode} doesn't exists.`);
        }
        return true;
    } catch (error) {
        console.error("Error updating attendance:", error);
        return false;
    }
};


export const regStud = async (studentDetails, teacherEmail) => {
    console.log(studentDetails);
    console.log(teacherEmail);
    console.log(studentDetails.course);

    // Encode teacher email for Firebase key compatibility
    const encodedTeacherEmail = encodeEmail(teacherEmail);

    try {
        // Step 1: Register the student in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            studentDetails.email,
            studentDetails.password,
        );
        console.log("Student registered in Firebase Authentication:", userCredential.user);

        // Step 2: Create a reference to the teacher's students node in the Realtime Database
        const db = getDatabase();
        const teacherStudentsRef = ref(
            db,
            `teachers/${encodedTeacherEmail}/students/${encodeEmail(studentDetails.email)}`
        );

        // Map the courses array with default subject codes
        const mappedSubjects = studentDetails.course.reduce((acc, course) => {
            const subjectCode = "Testing"; // Default subject code
            acc[course] = {
                code: subjectCode,
            };
            return acc;
        }, {});

        // Step 3: Save student details (except the password) in the Realtime Database
        await set(teacherStudentsRef, {
            name: studentDetails.studentName,
            subjects: mappedSubjects, // Store subjects with codes
        });

        console.log("Student registered successfully in Realtime Database!");
    } catch (error) {
        console.error("Error registering student:", error);
    }
};

// export const regStud = async (studentDetails, teacherEmail) => {
//     console.log(studentDetails);
//     console.log(teacherEmail);
//     console.log(studentDetails.course);

//     // Encode teacher email for Firebase key compatibility
//     const encodedTeacherEmail = encodeKey(teacherEmail);

//     try {
//         // Create a reference to the teacher's students node
//         const db = getDatabase();
//         const teacherStudentsRef = ref(db, `teachers/${encodedTeacherEmail}/students/${encodeKey(studentDetails.email)}`);

//         // Map the courses array with the default subject codes and add them to the student data
//         const mappedSubjects = studentDetails.course.reduce((acc, course) => {
//             const subjectCode = "Testing";  // Default to "UNKNOWN" if no match found
//             acc[course] = {
//                 code: subjectCode,
//             };
//             return acc;
//         }, {});

//         // Set the student data in Firebase
//         await set(teacherStudentsRef, {
//             password: await sha256(studentDetails.password),
//             name: studentDetails.studentName,
//             subjects: mappedSubjects,  // Store the subjects with their codes, totalClasses, and attendance
//         });

//         console.log("Student registered successfully!");
//     } catch (error) {
//         console.error("Error registering student:", error);
//     }
// };
// Function to increment total classes
export const addClassRecord = async (datecheck, teacherEmail, subjectName) => {
    try {
        // Extract parts of the date
        const hours = String(datecheck.getHours()).padStart(2, '0');  // Format: 2 digits for hours
        const day = String(datecheck.getDate()).padStart(2, '0');     // Format: 2 digits for day
        const month = String(datecheck.getMonth() + 1).padStart(2, '0'); // Format: 2 digits for month (0-based, so +1)
        const year = datecheck.getFullYear();  // Year in YYYY format

        // Create class ID: hhDDMMYYYY
        const classId = `${hours}${day}${month}${year}`;

        // Format class date: DD/MM/YYYY
        const classDate = `${day}/${month}/${year}`;

        // Encode teacher's email for Firebase key compatibility
        const encodedTeacherEmail = encodeKey(teacherEmail);

        // Get a reference to the teacher's students node in Firebase
        const db = getDatabase();
        const teacherRef = ref(db, `teachers/${encodedTeacherEmail}/students`);

        // Retrieve all students under the given teacher
        const snapshot = await get(teacherRef);

        if (snapshot.exists()) {
            const students = snapshot.val();

            // Loop through each student and add the class record under the specified subject
            for (const studentEmail in students) {
                const student = students[studentEmail];

                // Check if the subject exists for the student
                if (student.subjects && student.subjects[subjectName]) {
                    const subjectRef = ref(db, `teachers/${encodedTeacherEmail}/students/${encodeKey(studentEmail)}/subjects/${subjectName}/${classId}`);

                    // Create a new class record with the date and status
                    const classData = {
                        date: classDate,  // formatted date (DD/MM/YYYY)
                        status: 0,  // Default status is 0 (class not yet held)
                    };

                    // Update Firebase with the new class data for the student
                    await set(subjectRef, classData);

                    console.log(`Class added for ${subjectName} under ${student.name}`);
                }
            }
        } else {
            console.error("No students found under the teacher.");
        }
    } catch (error) {
        console.error("Error adding class record:", error);
    }
};
