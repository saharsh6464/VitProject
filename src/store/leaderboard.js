import { database } from './firebase'; // Firebase config import
import { ref, get } from 'firebase/database';

// Function to fetch attendance data and generate leaderboard
export async function generateLeaderboard() {
  const leaderboard = {};

  // Fetch all teachers from Firebase Realtime Database
  const teachersRef = ref(database, 'teachers');
  const teachersSnapshot = await get(teachersRef);

  if (teachersSnapshot.exists()) {
    const teachersData = teachersSnapshot.val();

    // Loop through each teacher's data
    for (let teacherEmail in teachersData) {
      leaderboard[teacherEmail] = {}; // Initialize subject-wise structure

      const teacherData = teachersData[teacherEmail];
      const students = teacherData.students;

      // Loop through each student
      for (let studentEmail in students) {
        const student = students[studentEmail];

        // Loop through each subject of the student
        for (let subject in student.subjects) {
          const subjectData = student.subjects[subject];

          // Initialize subject entry if not already present
          if (!leaderboard[teacherEmail][subject]) {
            leaderboard[teacherEmail][subject] = [];
          }

          let totalAttendance = 0;

          // Loop through each attendance record for this subject
          for (let date in subjectData) {
            if (subjectData[date].status === 1) {
              totalAttendance++; // Count present days (status: 1)
            }
          }

          // Add student to the leaderboard under the teacher's subject list
          leaderboard[teacherEmail][subject].push({
            name: student.name,
            email: studentEmail,
            totalAttendance: totalAttendance,
          });
        }
      }

      // Sort the students by total attendance (descending order) for each subject
      for (let subject in leaderboard[teacherEmail]) {
        leaderboard[teacherEmail][subject].sort((a, b) => b.totalAttendance - a.totalAttendance);
      }
    }
  }

  return leaderboard;
}
