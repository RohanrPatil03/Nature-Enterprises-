
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// IMPORTANT: Replace the configuration below with your own Firebase project's configuration.
// You can find this in your Firebase project settings under "Project settings" > "General".
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);

// Enable offline persistence for a more robust offline experience
try {
    enableIndexedDbPersistence(db);
} catch (error) {
    console.error("Error enabling offline persistence: ", error);
}

export { app, db };
