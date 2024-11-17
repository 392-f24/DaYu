// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cs392-dayu-bd95c.firebaseapp.com",
  projectId: "cs392-dayu-bd95c",
  storageBucket: "cs392-dayu-bd95c.firebasestorage.app",
  messagingSenderId: "389191954311",
  appId: "1:389191954311:web:bef4a80d423b54d068ad22",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
