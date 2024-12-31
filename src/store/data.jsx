import React, { createContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin, authenticateStudent } from "./auth";
import { markAttendance, addClassRecord, regStud } from "./utils";
import { checkFingerprintTime } from "./fingerprint";
import sha256 from "js-sha256";
import { saveTeacherCredentials,getSavedTeacherCredentials } from "./saveCredT";
import { saveCredentials } from "./saveCredS";
// Create context
export const dataContext = createContext({
  personDetails: {},
  createclass: () => {},
  registerStudent: () => {},
  createNewQR: () => {},
  viewClass: () => {},
  takeAttendance12: () => {},
  getClassAttendance: () => {},
});

// Reducer function
const dataReducer = (currData, action) => {
  switch (action.type) {
    case "DetailsT":
      return action.payload.data;
    case "RegisterStudent":
      console.log("Register Student action triggered");
      return currData;
    case "ScannedData":
      console.log("Attendance action triggered");
      return currData;
    default:
      return currData;
  }
};

const DataContextProvider = ({ children }) => {
  const [personDetails, dispatchData] = useReducer(dataReducer, {});
  const navigate = useNavigate();

  const createclass = async (data,check=true) => {
    if (data.role === "Teacher") {
      //const isLoggedIn = await handleLogin(data.email, await sha256(data.password));
      const isLoggedIn = await handleLogin(data.email, data.password);
      if (isLoggedIn) {
        dispatchData({ type: "DetailsT", payload: { data } });
        if(check)
        saveTeacherCredentials(data.email,data.password);
        navigate("/teacher-login/dashboard");
      
    }

    } else if (data.role === "Student") {
      const check=await checkFingerprintTime(data.email);
      const hash=(data.password);
      if (check) {
        const isLoggedIn = await authenticateStudent(
          data.name,
          data.email,
          hash
        );
        if (isLoggedIn) {
          dispatchData({ type: "DetailsT", payload: { data } });
          saveCredentials(data.email,data.password,data.name);
          navigate("/student-login/dashboard");
        }
      }
    }
  };

  const getClassAttendance = async (data) => {
    console.log(data);
    const success = await markAttendance(
      personDetails.name,
      personDetails.email,
      data.state.subjectCode,
      data.state.useDate
    );
    if (success) {
      navigate("/student-login/dashboard");
    }
  };

  const takeAttendance12 = (date, subjectCode) => {
    addClassRecord(date, personDetails.email, subjectCode);
  };

  const registerStudent = async (obj) => {
    console.log("Register Student function called with:", obj);
    await regStud(obj, obj.studentId);
  };

  return (
    <dataContext.Provider
      value={{
        personDetails,
        createclass,
        registerStudent, // Pass the actual registerStudent function here
        createNewQR: () => {},
        viewClass: () => {},
        takeAttendance12,
        getClassAttendance,
      }}
    >
      {children}
    </dataContext.Provider>
  );
};

export default DataContextProvider;
