// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "renuka-travels.firebaseapp.com",
  projectId: "renuka-travels",
  storageBucket: "renuka-travels.appspot.com",
  messagingSenderId: "739575227520",
  appId: "1:739575227520:web:b1dfd8e8e297e651677265"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);