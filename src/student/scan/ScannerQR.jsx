import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Scanner from "./Scanner";
import {checkFingerprintTime,generateAndStoreFingerprint} from "../../store/fingerprint";
// Haversine formula to calculate distance between two coordinates
import { useContext } from "react";
import { dataContext } from "../../store/data";
function QRCodeScanner({ userLocation }) {
  const { personDetails } = useContext(dataContext);
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  console.log("ScanQR" + userLocation);
  console.log(personDetails.email);
    // Fetch user location once on mount

  function calculateDistance(lat1, lon1) {
    console.log("calculateDistance:" + userLocation);
    console.log(lat1 + " " + lon1);
    if (!userLocation) {
      return -1;
    }
    const lat2 = userLocation[0];
    const lon2 = userLocation[1];
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    console.log(d);
    return d * 1000 < 200 ? R * c * 1000 : -1; // Distance in meters
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // Compare timestamps to check QR code expiration
  const compareTimestamps = (date1, date2) => {
    const time1 = new Date(date1);
    const time2 = new Date(date2);
    return Math.abs(time1 - time2) / 1000; // Difference in seconds
  };

  // Handle QR code scan
  const handleScan = async (data) => {
    if (data && !scannedData) {
      const parsedData = JSON.parse(data);
      const currentTime = new Date().toISOString();
      const secondsElapsed = compareTimestamps(
        currentTime,
        parsedData.datecheck
      );

      if (secondsElapsed > 20) {
        console.log("QR code expired");
        navigate("/student-login/dashboard/fail", { state: "QR code expired" });
        return false;
      }

      // Check if userLocation is available
      if (parsedData) {
        console.log(userLocation);
        console.log(parsedData);
        const distance = calculateDistance(
          parsedData.location.latitude,
          parsedData.location.longitude
        );

        if (distance==-1) {
          console.log(distance);
          console.log("Scanned data:", parsedData);
          setScannedData(data);
          setError(null);
          const parsedData1 = { ...parsedData, distance: distance };
          // handleLoad(parsedData1);
          console.log("Scan SUCESSFULL", parsedData1);

          const check=await checkFingerprintTime(personDetails.email);
          if(check) {
            await generateAndStoreFingerprint(personDetails.email);
            navigate("/student-login/dashboard/sucess", { state: parsedData1 });
            return true;
          }
          else {
            return false;
          }
        } else {
          console.log("User is out of range");
          navigate("/student-login/dashboard/fail", {
            state: "User is out of range",
          });
          return false;
        }
      } else {
        console.log("User location not yet available");
        navigate("/student-login/dashboard/fail", {
          state: "User location not yet available",
        });
        return false;
      }
    }
    navigate("/student-login/dashboard/fail", { state: "Error" });
    return false;
  };

  // Handle scanner errors
  const handleError = (err) => {};

  return (
    <div>

      {/* QR Code Scanner */}
      {!scannedData && <Scanner sendData={handleScan} />}

      {/* Display scanned data */}
      {scannedData && (
        <div>
          <h3>Scanned QR Code Data:</h3>
          <p>{scannedData}</p>
        </div>
      )}

      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default QRCodeScanner;