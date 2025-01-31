// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getDatabase } from "firebase/database";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlH4w8aOAkZ85-FEC2G-pvA0Zcc-t6f54",
  authDomain: "activetrack-69cad.firebaseapp.com",
  databaseURL: "https://activetrack-69cad-default-rtdb.firebaseio.com",
  projectId: "activetrack-69cad",
  storageBucket: "activetrack-69cad.firebasestorage.app",
  messagingSenderId: "78818215831",
  appId: "1:78818215831:web:7ccf679734f9fc900326d2",
  measurementId: "G-YBDJ8RR49K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;