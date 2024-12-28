import React, { createContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";

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

  const createclass = (data, check = true) => {
    console.log("Create class function called");
    // Logic will go here
  };

  const getClassAttendance = (data) => {
    console.log("Get class attendance function called");
    // Logic will go here
  };

  const takeAttendance12 = (date, subjectCode) => {
    console.log("Take attendance function called");
    // Logic will go here
  };

  const registerStudent = (obj) => {
    console.log("Register student function called");
    // Logic will go here
  };

  return (
    <dataContext.Provider
      value={{
        personDetails,
        createclass,
        registerStudent,
        createNewQR: () => {
          console.log("Create new QR function called");
        },
        viewClass: () => {
          console.log("View class function called");
        },
        takeAttendance12,
        getClassAttendance,
      }}
    >
      {children}
    </dataContext.Provider>
  );
};

export default DataContextProvider;
