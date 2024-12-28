// Save credentials (Login)
import { useNavigate } from "react-router-dom";
export const saveCredentials = (studentEmail, studentPassword, teacherEmail) => {
    const credentialsKey = "credentials";

    // Check if credentials are already saved
    const savedCredentials = JSON.parse(localStorage.getItem(credentialsKey));
    // Save credentials in local storage
    const credentials = {
        studentEmail,
        studentPassword,
        teacherEmail,
    };
    localStorage.setItem(credentialsKey, JSON.stringify(credentials));
    console.log("Credentials saved successfully.");

};

// Auto-get details
export const getSavedCredentials = () => {
    const credentialsKey = "credentials";

    // Retrieve credentials from local storage
    const savedCredentials = JSON.parse(localStorage.getItem(credentialsKey));
    if (savedCredentials) {
        console.log("Retrieved saved credentials:", savedCredentials);
        return savedCredentials; // Return the credentials object
    } else {
        console.log("No credentials found.");
        return null;
    }
};

// Logout (Clear Credentials)
export const logout = () => {
    try {
        const credentialsKey = "credentials";
        // Remove credentials from local storage
        localStorage.removeItem(credentialsKey);
        console.log("Credentials removed. User logged out.");
        return true;
    }
    catch {
        return false;
    }
};
