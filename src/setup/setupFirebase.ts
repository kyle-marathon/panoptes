// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkiUbpwAWHWyUcjVLOhxDrOhChURuw4Ko",
  authDomain: "pano-41fdf.firebaseapp.com",
  databaseURL: "https://pano-41fdf-default-rtdb.firebaseio.com",
  projectId: "pano-41fdf",
  storageBucket: "pano-41fdf.appspot.com",
  messagingSenderId: "572566267300",
  appId: "1:572566267300:web:95ee7f86e4415ebb528d31",
  measurementId: "G-WL49STLDQ5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// import { getDatabase, ref, set, onValue } from "firebase/database";
// import {
//   GoogleAuthProvider,
//   getAuth,
//   signInWithPopup,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   sendPasswordResetEmail,
//   signOut,
// } from "firebase/auth";

// export const testVar = "testing exports";

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBkiUbpwAWHWyUcjVLOhxDrOhChURuw4Ko",
//   authDomain: "pano-41fdf.firebaseapp.com",
//   databaseURL: "https://pano-41fdf-default-rtdb.firebaseio.com",
//   projectId: "pano-41fdf",
//   storageBucket: "pano-41fdf.appspot.com",
//   messagingSenderId: "572566267300",
//   appId: "1:572566267300:web:95ee7f86e4415ebb528d31",
//   measurementId: "G-WL49STLDQ5",
// };

// initializeApp(firebaseConfig);

// // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);

// export const db = getDatabase();
// export const dbRef = ref(getDatabase());

// // export const auth = getAuth(app);

// // // Import the functions you need from the SDKs you need
// // import { initializeApp } from "firebase/app";
// // import { initializeAnalytics, getAnalytics } from "firebase/analytics";

// // // TODO: Add SDKs for Firebase products that you want to use
// // // https://firebase.google.com/docs/web/setup#available-libraries

// // import {
// //   getFirestore,
// //   query,
// //   getDocs,
// //   collection,
// //   where,
// //   addDoc,
// // } from "firebase/firestore";
// // import { getDatabase, ref, set, onValue } from "firebase/database";

// // // Your web app's Firebase configuration
// // // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// // const firebaseConfig = {
// //   apiKey: "AIzaSyBkiUbpwAWHWyUcjVLOhxDrOhChURuw4Ko",
// //   authDomain: "pano-41fdf.firebaseapp.com",
// //   databaseURL: "https://pano-41fdf-default-rtdb.firebaseio.com",
// //   projectId: "pano-41fdf",
// //   storageBucket: "pano-41fdf.appspot.com",
// //   messagingSenderId: "572566267300",
// //   appId: "1:572566267300:web:95ee7f86e4415ebb528d31",
// //   measurementId: "G-WL49STLDQ5",
// // };

// // // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// // // const analytics = getAnalytics(app);

// // // export const firestoreDb = getFirestore(app);
// // // export const db = getDatabase();

// // export const auth = getAuth(app);

// // const googleProvider = new GoogleAuthProvider();
// // export const signInWithGoogle = async () => {
// //   try {
// //     const res = await signInWithPopup(auth, googleProvider);
// //     const user = res.user;
// //     const q = query(
// //       collection(firestoreDb, "users"),
// //       where("uid", "==", user.uid)
// //     );
// //     const docs = await getDocs(q);
// //     if (docs.docs.length === 0) {
// //       await addDoc(collection(firestoreDb, "users"), {
// //         uid: user.uid,
// //         name: user.displayName,
// //         authProvider: "google",
// //         email: user.email,
// //       });
// //     }
// //   } catch (err) {
// //     console.error(err);
// //     // @ts-ignore
// //     alert(err.message);
// //   }
// // };

// // // const logout = () => {
// // //   signOut(auth);
// // // };

// export const lastIdPath = "lastId";
// export const hasItemsPath = "hasItems";
