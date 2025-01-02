// import { ref, set } from "firebase/database";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "./firebase";
// import { encodeEmail } from "./utils";
// import { getDatabase, get } from "firebase/database";

// Authenticate Student using Firebase Auth
import { ref, get } from "firebase/database";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { encodeEmail } from "./utils";
import { getDatabase } from "firebase/database";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
export const authenticateStudent = async (teacherEmail, studentEmail, password) => {
    const database = getDatabase();
    const safeTeacherEmail = encodeEmail(teacherEmail);
    const safeStudentEmail = encodeEmail(studentEmail);
    console.log(password);
    const studentRef = ref(
        database,
        `teachers/${safeTeacherEmail}/students/${safeStudentEmail}`
    );

    try {
        // Step 1: Authenticate the student using Firebase Auth
        await signInWithEmailAndPassword(auth, studentEmail, password);

        // Step 2: Check if the student exists under the teacher's record
        const studentSnapshot = await get(studentRef);

        if (studentSnapshot.exists()) {
            alert("Authentication successful! Student verified under teacher's record.");
            return true;
        } else {
            alert("Student not found in the teacher's record.");
            return false;
        }
    } catch (error) {
        console.error("Error authenticating:", error);
        alert(`Authentication failed: ${error.message}`);
        return false;
    }
};

// Handle Login for Teachers using Firebase Auth
export const handleLogin = async (email, password) => {
    try {
        // Use Firebase Authentication to validate teacher credentials
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Reference to the teachers node in the database
        const encodeKey = (key) => key.replace(/\./g, ",");
        const encodedEmail = encodeKey(email);

        const db = getDatabase();
        const teachersRef = ref(db, `teachers/${encodedEmail}`);

        // Fetch teacher data from the database
        const snapshot = await get(teachersRef);

        if (snapshot.exists()) {
            const teacherData = snapshot.val();
            console.log("Login successful!");
            console.log("Teacher Data:", teacherData);

            // Perform any post-login actions
            return true;
        } else {
            alert("Teacher data not found in the database.");
            return false;
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert(`Login failed: ${error.message}`);
        return false;
    }
};

// Import the Firebase Authentication library


// Initialize Firebase Authentication

// Function to handle password reset request
export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent successfully!");
    } catch (error) {
        alert("Error sending password reset email:", error);
    }
}

// // Example usage:
// resetPassword("user@example.com");




// import { ref, set } from "firebase/database";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "./firebase";
// import { encodeEmail } from "./utils";
// import { getDatabase, get } from "firebase/database";

// export const authenticateStudent = async (
//     teacherEmail,
//     studentEmail,
//     password
// ) => {
//     const database = getDatabase();
//     const safeTeacherEmail = encodeEmail(teacherEmail);
//     const safeStudentEmail = encodeEmail(studentEmail);
//     const studentRef = ref(
//         database,
//         `teachers/${safeTeacherEmail}/students/${safeStudentEmail}`
//     );
//     const lastLoginRef = ref(database, `teachers/${safeTeacherEmail}/lastLogin`);

//     try {
//         const studentSnapshot = await get(studentRef);
//         // const lastLoginSnapshot = await get(lastLoginRef);
//         const now = Date.now();

//         if (studentSnapshot.exists()) {
//             const student = studentSnapshot.val();
//             if (student.password === password) {
//                 // if (lastLoginSnapshot.exists()) {
//                 //     const { timestamp, lastStudentEmail } = lastLoginSnapshot.val();
//                 //     const timeElapsed = (now - timestamp) / 1000;
//                 //     if (timeElapsed < 15 && lastStudentEmail !== safeStudentEmail) {
//                 //         alert(`Please wait ${(15 - timeElapsed).toFixed(1)} seconds`);
//                 //         return false;
//                 //     }
//                 // }

//                 await set(lastLoginRef, {
//                     timestamp: now,
//                     lastStudentEmail: safeStudentEmail,
//                 });
//                 alert("Authentication successful!");
//                 return true;
//             } else {
//                 alert("Incorrect password.");
//                 return false;
//             }
//         } else {
//             alert("Student not found.");
//             return false;
//         }
//     } catch (error) {
//         console.error("Error authenticating:", error);
//         alert("Error during authentication.");
//         return false;
//     }
// };

// export const handleLogin = async (email, password) => {
//     try {
//         // Encode the email to match the Firebase key structure
//         const encodeKey = (key) => key.replace(/\./g, ",");
//         const encodedEmail = encodeKey(email);

//         // Reference to the teachers node in the database
//         const db = getDatabase();
//         const teachersRef = ref(db, `teachers/${encodedEmail}`);

//         // Fetch teacher data from Firebase
//         const snapshot = await get(teachersRef);

//         if (snapshot.exists()) {
//             const teacherData = snapshot.val();

//             // Check if the password matches
//             if (teacherData.password === password) {
//                 console.log("Login successful!");
//                 console.log("Teacher Data:", teacherData);

//                 // Perform any actions after successful login, e.g., redirect to dashboard
//                 return true;
//             } else {
//                 alert("Invalid password.");
//                 return false;
//             }
//         } else {
//             alert("Teacher not found.");
//             return false;
//         }
//     } catch (error) {
//         alert("Error during login:", error);
//         return false;
//     }
// };
