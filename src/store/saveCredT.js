export const saveTeacherCredentials = (teacherEmail, teacherPassword) => {
    const teacherCredentialsKey = "teacherCredentials";

    // Check if credentials are already saved
    const savedCredentials = JSON.parse(localStorage.getItem(teacherCredentialsKey));
    // Save teacher credentials in local storage
    const credentials = {
        teacherEmail,
        teacherPassword,
    };
    localStorage.setItem(teacherCredentialsKey, JSON.stringify(credentials));
    console.log("Teacher credentials saved successfully.");


};

export const getSavedTeacherCredentials = () => {
    const teacherCredentialsKey = "teacherCredentials";

    // Retrieve teacher credentials from local storage
    const savedCredentials = JSON.parse(localStorage.getItem(teacherCredentialsKey));
    if (savedCredentials) {
        console.log("Retrieved saved teacher credentials:", savedCredentials);
        return savedCredentials; // Return the credentials object
    } else {
        console.log("No teacher credentials found.");
        return null;
    }
};

export const logoutTeacher = () => {
    const teacherCredentialsKey = "teacherCredentials";

    // Remove teacher credentials from local storage
    localStorage.removeItem(teacherCredentialsKey);

    console.log("Teacher credentials removed. Teacher logged out.");
};

