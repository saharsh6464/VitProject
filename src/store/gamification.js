import { ref, set, get } from "firebase/database";
import { database } from "./firebase";

// Utility function to encode email
export const encodeEmail = (email) => email.replace(/\./g, ",");

// Function to ensure the "gami" folder exists
async function ensureGamiFolderExists(teacherEmail, studentEmail) {
    const encodedTeacherEmail = encodeEmail(teacherEmail);
    const encodedStudentEmail = encodeEmail(studentEmail);
    const gamiRef = ref(database, `teachers/${encodedTeacherEmail}/students/${encodedStudentEmail}/gami`);

    try {
        const snapshot = await get(gamiRef);
        if (!snapshot.exists()) {
            // Create a default structure for the "gami" folder if it doesn't exist
            const defaultData = {
                score: 0,
                currStreak: 0,
                maxStreak: 0,
                date: null,
            };
            await set(gamiRef, defaultData);
        }
    } catch (error) {
        console.error("Error ensuring gami folder exists:", error);
    }
}

// Function 1: Updates streaks and score based on the date
export async function updateStreaks(teacherEmail, studentEmail) {
    const encodedTeacherEmail = encodeEmail(teacherEmail);
    const encodedStudentEmail = encodeEmail(studentEmail);
    const gamiRef = ref(database, `teachers/${encodedTeacherEmail}/students/${encodedStudentEmail}/gami`);

    await ensureGamiFolderExists(teacherEmail, studentEmail);

    try {
        const snapshot = await get(gamiRef);
        const defaultData = {
            score: 0,
            currStreak: 0,
            maxStreak: 0,
            date: null,
        };
        let data = snapshot.exists() ? snapshot.val() : defaultData;

        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD

        if (data.date === today) {
            // If the date matches today's date, only update the score
            data.score += 1;
        } else {
            const lastDate = new Date(data.date);
            const diffDays = Math.ceil((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // If there's a one-day difference, increment streak and score
                data.currStreak += 1;
                if (data.currStreak > data.maxStreak) {
                    data.maxStreak = data.currStreak;
                }
            } else if (diffDays > 1) {
                // If the gap is more than one day, reset streak
                data.currStreak = 0;
            }
            // Update the score and set today's date
            data.score += 1;
            data.date = today;
        }

        // Save updated data back to Firebase
        await set(gamiRef, data);
    } catch (error) {
        console.error("Error updating streaks:", error);
    }
}

// Function 2: Fetches and returns streak and score data
export async function fetchStreaks(teacherEmail, studentEmail) {
    const encodedTeacherEmail = encodeEmail(teacherEmail);
    const encodedStudentEmail = encodeEmail(studentEmail);
    const gamiRef = ref(database, `teachers/${encodedTeacherEmail}/students/${encodedStudentEmail}/gami`);

    await ensureGamiFolderExists(teacherEmail, studentEmail);

    try {
        const snapshot = await get(gamiRef);
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            // If no data exists, return default structure
            return {
                score: 0,
                currStreak: 0,
                maxStreak: 0,
                date: null,
            };
        }
    } catch (error) {
        console.error("Error fetching streaks:", error);
        return {
            score: 0,
            currStreak: 0,
            maxStreak: 0,
            date: null,
        };
    }
}

