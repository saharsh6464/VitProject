import React, { useState, useRef } from 'react';
import { QrReader } from 'react-qr-reader';

function Scanner({ sendData }) {
  const [scannerData, setScannerData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const ref = useRef(null);

  const handleScan = (data) => {
    if (data) {
      console.log("Scanned data:", data);
      setScannerData(data);
      return true; // Indicate successful scan
    }
    return false;
  };

  const handleData = () => {
    setTimeout(() => {
      console.log("Handle Data");
      sendData(scannerData);
      return true;
    }, 5000);
  };

  const handleError = (error) => {
    console.log("QR Reader Error:", error);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark bg-gray-900 text-white min-h-screen' : 'bg-gray-100 text-gray-900 min-h-screen'}>
      <div className="container mx-auto p-4">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 mb-4 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Toggle {darkMode ? 'Light' : 'Dark'} Theme
        </button>

        {!scannerData && (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Scan the QR Code:</h3>
            <div className="relative mx-auto w-96 h-96 border-4 border-dashed border-gray-400 rounded-md">
              <QrReader
                ref={ref}
                onResult={(result, error) => {
                  if (result) {
                    if (handleScan(atob(result))) {
                      try {
                        ref.current.stopCamera(); // Stop the camera after a successful scan
                      } catch (err) {
                        console.error("Error stopping camera:", err);
                      }
                    }
                  }
                  if (error) {
                    handleError(error);
                  }
                }}
                style={{ width: '100%', height: '100%' }}
                constraints={{
                  facingMode: 'environment', // Specify camera type: 'environment' for rear, 'user' for front
                }}
                scanDelay={500}
              />
            </div>
          </div>
        )}
        {scannerData && (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Scanned QR Code Data:</h3>
            <p className="mb-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-md">{scannerData}</p>
            {handleData()};
          </div>
        )}
      </div>
    </div>
  );
}

export default Scanner;

