// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdsTPuvKtusx3RCdexOnWOWYYJab3YNco",
  authDomain: "capstone-a82dc.firebaseapp.com",
  projectId: "capstone-a82dc",
  storageBucket: "capstone-a82dc.firebasestorage.app",
  messagingSenderId: "1044043857556",
  appId: "1:1044043857556:web:b5e4af1ea07e209db4be81",
  measurementId: "G-7TZTP8SJ4R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  
// const analytics = getAnalytics(app);

export {app, auth};