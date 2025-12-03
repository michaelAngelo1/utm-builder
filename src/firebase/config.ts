// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuNOr8I_ok3sMuHECbXTaGPETucBkEoME",
  authDomain: "utm-database.firebaseapp.com",
  projectId: "utm-database",
  storageBucket: "utm-database.firebasestorage.app",
  messagingSenderId: "1004550689530",
  appId: "1:1004550689530:web:bcb33feb653716bc4f6f43",
  measurementId: "G-NNRZQHQ8PM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);