
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// =================================================================================
// IMPORTANT: CONFIGURE YOUR FIREBASE PROJECT
// =================================================================================
// To connect this application to your Firebase project, you need to add your
// project's configuration details below.
//
// How to get your Firebase config:
// 1. Go to the Firebase Console: https://console.firebase.google.com/
// 2. Select your project (or create a new one).
// 3. In the project overview, click the "</>" icon to add a web app (if you
//    haven't already).
// 4. Give your app a nickname and click "Register app".
// 5. You'll see the firebaseConfig object. Copy its contents and paste them here,
//    replacing the placeholder values.
// =================================================================================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your actual API Key
  authDomain: "YOUR_AUTH_DOMAIN", // Replace with your actual Auth Domain
  projectId: "YOUR_PROJECT_ID", // Replace with your actual Project ID
  storageBucket: "YOUR_STORAGE_BUCKET", // Replace with your actual Storage Bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your actual Messaging Sender ID
  appId: "YOUR_APP_ID" // Replace with your actual App ID
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);

// Enable offline persistence for a more robust offline experience.
// This allows the app to work even when the user is offline by caching data.
try {
    enableIndexedDbPersistence(db);
} catch (error) {
    if (error instanceof Error && 'code' in error) {
        if ((error as {code: string}).code == 'failed-precondition') {
            console.warn("Firebase offline persistence could not be enabled. It can only be enabled in one tab at a time.");
        } else if ((error as {code: string}).code == 'unimplemented') {
            console.log("The current browser does not support all of the features required to enable persistence.");
        }
    } else {
         console.error("Error enabling offline persistence: ", error);
    }
}

export { app, db };
