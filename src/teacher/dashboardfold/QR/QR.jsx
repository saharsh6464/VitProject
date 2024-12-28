import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function QRCodeGenerator() {
    const navigate = useNavigate();
    const dashData = useLocation();
    console.log("QR DATA");
    console.log(dashData.state);

    const [qrCodeData, setQrCodeData] = useState('');
    const [location, setLocation] = useState(null);

    // Function to get the user's location (only once on mount)
    async function getLocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        resolve([latitude, longitude]);
                    },
                    (error) => {
                        reject(`Geolocation error: ${error.message}`);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0,
                    }
                );
            } else {
                reject("Geolocation is not supported by this browser.");
            }
        });
    }

    useEffect(() => {
        // Fetch location once on component mount
        const fetchLocationAndGenerateQR = async () => {
            try {
                const loc = await getLocation();
                setLocation(loc); // Set the location state once
                console.log("User's location:", loc);

                // Generate initial QR code with location and timestamp
                generateQRCode(loc);
            } catch (error) {
                console.error(error);
            }
        };

        fetchLocationAndGenerateQR();

    }, []); // Empty dependency array to only run once on mount

    useEffect(() => {
        // Only start interval once location is set
        if (location) {
            const intervalId = setInterval(() => {
                generateQRCode(location); // Only update timestamp
            }, 5000);

            // Clear interval on component unmount
            return () => {
                clearInterval(intervalId);
                console.log("Clear Interval");
            };
        }
    }, [location]); // Depend on location so interval only starts once location is set

    // Function to generate QR code
    const generateQRCode = async (loc) => {
        try {
            const data = {
                "subjectCode": dashData.state,
                "date": new Date().toLocaleDateString(),
                "useDate": new Date(),
                "datecheck": new Date().toISOString(),
                "location": loc // Use the stored location
            };

            console.log("Data object for QR generation:", data); // Debugging: log data object

            // Generate the QR code with the data object
            const qrCodeData = await QRCode.toDataURL(btoa(JSON.stringify(data)));
            setQrCodeData(qrCodeData); // Set the QR code data URL to state
        } catch (err) {
            console.error("Failed to generate QR code", err);
        }
    };

    const handleMarkAttendance = () => {
        navigate('/teacher-login/dashboard');
    };

    const attendanceMessage = "Wait";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Mark Attendance</h1>
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
                <p className="text-center text-gray-700 mb-4">Scan the QR code to mark your attendance:</p>
                {qrCodeData && <img src={qrCodeData} alt="Generated QR Code" className="mx-auto mb-4 w-48 h-48" />}
                <button 
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                    onClick={handleMarkAttendance}
                >
                    Close
                </button>
                <div className="text-center text-gray-600 mt-4">{attendanceMessage}</div>
            </div>
        </div>
    );
}

export default QRCodeGenerator;

