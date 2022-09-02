// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-7tdEdhI4GikBTdDhCEkhyU5TNj0qb_8",
  authDomain: "zoan-fruit.firebaseapp.com",
  projectId: "zoan-fruit",
  storageBucket: "zoan-fruit.appspot.com",
  messagingSenderId: "297874581263",
  appId: "1:297874581263:web:04630fa9dc28b6f5e4007a",
  measurementId: "G-R7WRE2C6Y3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
