import { getDatabase, ref, get, set, update } from "firebase/database";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { SignJWT, jwtVerify } from "jose"; // Import jose library

const encodeKey = (key) => key.replace(/\./g, ",");
const jwtSecret = new TextEncoder().encode("9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"); // Generate a strong secret key

// Generate JWT
const generateJWT = async (payload) => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(jwtSecret);
};

// Verify JWT
const verifyJWT = async (token) => {
    try {
        const { payload } = await jwtVerify(token, jwtSecret);
        return payload;
    } catch (err) {
        console.error("Invalid or expired token:", err.message);
        return null;
    }
};

export async function generateAndStoreFingerprint(email1) {
    const email = encodeKey(email1);
    const db = getDatabase();
    const accessTokenKey = "access_token";
    const jwtToken = localStorage.getItem(accessTokenKey);

    if (!jwtToken || !(await verifyJWT(jwtToken))) {
        // Generate fingerprint
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const fingerprint = result.visitorId;

        // Generate JWT with fingerprint and email
        const newToken = await generateJWT({ fingerprint, email });
        localStorage.setItem(accessTokenKey, newToken);

        // Save fingerprint data to Firebase
        await set(ref(db, `fingerprints/${fingerprint}`), {
            email,
            time: new Date().toISOString(),
        });
    } else {
        // Decode the JWT to get the fingerprint
        const decoded = await verifyJWT(jwtToken);
        const { fingerprint } = decoded;

        // Update the Firebase entry
        await update(ref(db, `fingerprints/${fingerprint}`), {
            email,
            time: new Date().toISOString(),
        });
    }
}

export async function checkFingerprintTime(email1, thresholdMinutes = 5) {
    console.log(1);
    const email = encodeKey(email1);
    const db = getDatabase();
    const accessTokenKey = "access_token";
    const jwtToken = localStorage.getItem(accessTokenKey);

    if (!jwtToken || !(await verifyJWT(jwtToken))) {
        console.log("No valid token found; you can proceed.");
        return true;
    }

    const decoded = await verifyJWT(jwtToken);
    const { fingerprint } = decoded;

    const snapshot = await get(ref(db, `fingerprints/${fingerprint}`));
    if (!snapshot.exists()) {
        console.log("Token not found in Firebase; you can proceed.");
        return true;
    }

    const firebaseData = snapshot.val();
    const storedTime = new Date(firebaseData.time);
    const currentTime = new Date();

    const timeDifference = (currentTime - storedTime) / (1000 * 60); // Time difference in minutes

    if (timeDifference > thresholdMinutes) {
        console.log("Success");
        return true;
    } else if (email == firebaseData.email) {
        return true;
    } else {
        alert(`Time left: ${(5 - timeDifference).toFixed(2)} minutes`);
        return false;
    }
}

