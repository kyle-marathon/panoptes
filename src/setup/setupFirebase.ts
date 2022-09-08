// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import { getDatabase, ref, set, onValue } from "firebase/database";

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

export const firestoreDb = getFirestore(app);
export const db = getDatabase();

export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(
      collection(firestoreDb, "users"),
      where("uid", "==", user.uid)
    );
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(firestoreDb, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    // @ts-ignore
    alert(err.message);
  }
};

// const logout = () => {
//   signOut(auth);
// };

export const lastIdPath = "lastId";
export const hasItemsPath = "hasItems";
