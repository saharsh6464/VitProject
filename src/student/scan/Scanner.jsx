import React, { useState, useRef } from 'react';
import {QrReader} from 'react-qr-reader';

function Scanner({sendData}) {
  const [scannerData, setScannerData] = useState(null);
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
    setTimeout( ()=>
    {console.log("Handle Data");
    sendData(scannerData);
    return true;},5000)
  }

  const handleError = (error) => {
    // console.error("QR Reader Error:", error);
  };

  
  return (
    <>
      {!scannerData && (
        <div>
          <h3>Scan the QR Code:</h3>
          <QrReader
            ref={ref}
            onResult={(result, error) => {
              if (result) {
                if (handleScan(atob(result))) {
                  try{
                    ref.current.stopCamera(); // Stop the camera after a successful scan
                  }
                  catch (err) {
                    
                  }
                }
              }
              if (error) {
                handleError(error);
              }
            }}
            style={{ width: '100%' }}
            constraints={{
              facingMode: 'environment' // Specify camera type: 'environment' for rear, 'user' for front
            }}
          />
        </div>
      )}
      {scannerData && (
        <div>
          <h3>Scanned QR Code Data:</h3>
          <p>{scannerData}</p>
          {handleData()};
        </div>
      )}
    </>
  );
}

export default Scanner;
