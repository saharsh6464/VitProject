

import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
    apiKey: "AIzaSyBTFq0EH_c1-L8cMAneAI9k8-F2hhTr6W8",
    authDomain: "hackelite-81993.firebaseapp.com",
    projectId: "hackelite-81993",
    storageBucket: "hackelite-81993.firebasestorage.app",
    messagingSenderId: "839629156475",
    appId: "1:839629156475:web:ea6095b4783739b680b2de",
    measurementId: "G-XWJ45TEEV5"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export const auth = getAuth(app);
export { database, app };

