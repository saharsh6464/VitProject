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
export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent successfully!");
    } catch (error) {
        alert("Error sending password reset email:", error);
    }
}