import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./routes/App.jsx";
import AttendancePortal from "./signup/SignUp.jsx";
import LoginPageT from "./teacher/LogInT.jsx";
import LoginPageS from "./student/LogInS.jsx";
import DashboardS from "./student/dashboard.jsx";
import DashboardT from "./teacher/dashboardfold/dashboardT.jsx";
import QRCodeGenerator from "./teacher/dashboardfold/QR/QR.jsx";
import ScannerLoc from "./student/Scan/ScannerLoc.jsx";
import SuccessPage from "./student/Scan/ScanSucc.jsx";
import FailPage from "./student/Scan/ScanFail.jsx";
import Register from "./teacher/dashboardfold/regstd.jsx";
import SubjectData from "./teacher/dashboardfold/SubData.jsx";
import TwoEmailTextInput from "./teacher/dashboardfold/markAtt.jsx";
import StudentSubjects from "./student/subData.jsx";
import StudentDetails from "./teacher/dashboardfold/studentDet.jsx";
import StudentSubjectDetails from "./student/studSub.jsx";
import Leaderboard from "./signup/Leaderboard.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <AttendancePortal /> },
      {
        path: "/student-login",
        element: <LoginPageS />,
      },
      {
        path: "/teacher-login",
        element: <LoginPageT />,
      },
      { path: "/student-login/dashboard", element: <DashboardS /> },
      { path: "/teacher-login/dashboard", element: <DashboardT /> },
      { path: "/student-login/dashboard/leaderboard", element: <Leaderboard /> },
      { path: "/teacher-login/dashboard/leaderboard", element: <Leaderboard /> },
      { path: "/teacher-login/dashboard/register", element: <Register /> },
      { path: "/teacher-login/dashboard/QR", element: <QRCodeGenerator /> },
      {
        path: "/teacher-login/dashboard/subjectData",
        element: <SubjectData />,
      },
      {
        path: "/teacher-login/dashboard/subjectData/student",
        element: <StudentDetails />,
      },
      {
        path: "/teacher-login/dashboard/mannual",
        element: <TwoEmailTextInput />,
      },
      {
        path: "/student-login/dashboard/get-Attendance",
        element: <ScannerLoc />,
      },
      {
        path: "/student-login/dashboard/viewAttd",
        element: <StudentSubjects />,
      },
      {
        path: "/student-login/dashboard/viewAttd/subj",
        element: <StudentSubjectDetails />,
      },
      { path: "/student-login/dashboard/sucess", element: <SuccessPage /> },
      { path: "/student-login/dashboard/fail", element: <FailPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
