# Attendance Portal

## Project Overview
The Attendance Portal is a modern solution to streamline and digitize the attendance process, ensuring accuracy, accountability, and convenience for both teachers and students.

---

## Key Features
- **Dynamic Attendance Codes**: Automatically generated time-sensitive QR codes and hashcodes to prevent proxy attendance.
- **Manual Attendance with Ease**: Teachers can mark attendance manually, ensuring flexibility in case of technical issues.
- **Real-time Insights**: Visual dashboards for tracking attendance statistics, including total classes and absentee details.
- **Thematic Mode Support**: Toggle between light and dark modes for user-friendly accessibility.

---

## Quick Start Guide
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd attendance-portal
   ```

2. **Install Dependencies**:
   ```bash
   npm install @fingerprintjs/fingerprintjs@^4.5.1 axios@^1.7.8 emailjs-com@^3.2.0 firebase@^11.0.1 jose@^5.9.6 js-sha256@^0.11.0 jwt-decode@^4.0.0 qrcode@^1.5.4 react@^18.3.1 react-dom@^18.3.1 react-icons@^5.4.0 react-qr-barcode-scanner-18@^1.2.2 react-qr-reader@^3.0.0-beta-1 react-router-dom@^6.27.0 recharts@^2.13.3 start@^5.1.0 uuid@^11.0.3
   ```

3. **Setup Firebase**:
   Replace the Firebase configuration in your project with the following code template:
   ```javascript
   // Import the functions you need from the SDKs you need
   import { initializeApp } from "firebase/app";
   import { getAnalytics } from "firebase/analytics";
   // TODO: Add SDKs for Firebase products that you want to use
   // https://firebase.google.com/docs/web/setup#available-libraries

   // Your web app's Firebase configuration
   const firebaseConfig = {
     apiKey: "<YOUR_API_KEY>",
     authDomain: "<YOUR_AUTH_DOMAIN>",
     databaseURL: "<YOUR_DATABASE_URL>",
     projectId: "<YOUR_PROJECT_ID>",
     storageBucket: "<YOUR_STORAGE_BUCKET>",
     messagingSenderId: "<YOUR_MESSAGING_SENDER_ID>",
     appId: "<YOUR_APP_ID>",
     measurementId: "<YOUR_MEASUREMENT_ID>"
   };

   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
   const analytics = getAnalytics(app);
   ```

4. **Run the Application**:
   ```bash
   npm start
   ```

5. **Navigate the Portal**:
   - Teachers can register students, manage classes, and take attendance using QR codes or manual entry.
   - Students can view their attendance records and access subject-wise details.

---

## Directory Structure
```
attendance-portal/
|-- src/
|   |-- components/        # React components for UI
|   |-- store/             # Context API and state management
|   |-- pages/             # Main pages (Dashboard, Login, etc.)
|   |-- utils/             # Utility functions
|-- public/                # Static assets
|-- package.json           # Project configuration
```

---
## Project Demo
Experience the live application:  
**[Hosted Application Link](<hosted-application-link>)**  
**[Demo Video](<demo-video-link>)**
---

## Project Report
For detailed information about the project, refer to the project report:  
**[Download Project Report PDF](https://drive.google.com/file/d/18GYsxZCyIY5ZMbPezyBxqJidtIjm50gu/view?usp=drive_link)**

