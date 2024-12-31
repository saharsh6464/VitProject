import React, { useEffect, useState } from "react";

import QRCodeScanner from "./ScannerQR";
// Function to fetch the user's location
async function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve([ latitude, longitude ]);
        },
        (error) => {
          reject(`Geolocation error: ${error.message}`);
        }
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
}
async function getIP() {
    // Fetch the IP address from the API
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;  // Return only the IP address
}


// // Wrapper to fetch and log the location
// async function fetchLocation() {
//     try {
//       const location = await getLocation();
//       console.log("Fetched Location:", location); // Log fetched location
//       console.log("Fetched Location:", typeof(location)); // Log fetched location
//       return location; // Return the location object directly
//     } catch (error) {
//       console.error("Error fetching location:", error);
//       return null; // Return null if there's an error
//     }
// }

const ScannerLoc= ({handleLoad}) => {
    const [userLocation, setUserLocation] = useState(null);
    const [userIP, setUserIP] = useState(null);
    useEffect(() => {
        const initializeLocation = async () => {
          const location = await getLocation();
          const dataip=await getIP();
          setUserIP(dataip);
          setUserLocation(location);
        };
        initializeLocation();
      }, []);

    return <>

        {userLocation && userIP && <QRCodeScanner handleLoad={handleLoad} userIP={userIP} userLocation={userLocation}/>}
    </>
}
export default ScannerLoc;