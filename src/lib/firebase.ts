import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDqMGRdo81ama2nQ3fLHRUFelKyu8D0w4s",
    authDomain: "lavaza-entry.firebaseapp.com",
    projectId: "lavaza-entry",
    storageBucket: "lavaza-entry.firebasestorage.app",
    messagingSenderId: "709783179125",
    appId: "1:709783179125:web:7b75b0cfa9e772bf1f8d3c",
};

// Prevent re-initialization (important for Next.js)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Firebase Auth (THIS FIXES YOUR ERROR)
export const auth = getAuth(app);

// ✅ Firestore database
export const db = getFirestore(app);
