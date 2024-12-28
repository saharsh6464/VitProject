// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0VOpiBU94OD11tXC0R5YVljJdr7HZkcY",
  authDomain: "vitvellore-532e1.firebaseapp.com",
  databaseURL: "https://vitvellore-532e1-default-rtdb.firebaseio.com",
  projectId: "vitvellore-532e1",
  storageBucket: "vitvellore-532e1.firebasestorage.app",
  messagingSenderId: "1055507517188",
  appId: "1:1055507517188:web:5295a2742bd5dcd4700a51",
  measurementId: "G-KPD7SSRR61"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export const auth = getAuth(app);
export { database, app };

