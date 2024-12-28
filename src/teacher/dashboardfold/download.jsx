import React from "react";

const SHEET_ID = "1nvA9tEUU_G4kCv6SbUWF1DE2ODoRwVXkFoROtUTmUIk"; 

function DownloadSheet() {
  const handleDownload = () => {
    const downloadUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=xlsx`;
    
    // Trigger the download
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "Teacher_Attendance_Sheet.xlsx"; // Default download filename
    link.click();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button onClick={handleDownload} style={buttonStyle}>
        Download Google Sheet
      </button>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  backgroundColor: "#4285F4",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default DownloadSheet;
