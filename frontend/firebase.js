// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "foodbus-20cc2.firebaseapp.com",
  projectId: "foodbus-20cc2",
  storageBucket: "foodbus-20cc2.firebasestorage.app",
  messagingSenderId: "727827650972",
  appId: "1:727827650972:web:e11aefec9de1cbaaf05059"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)

export{app,auth}