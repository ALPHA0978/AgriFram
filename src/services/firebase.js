// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4Dbwufjxq3lv6r1jWW-fFlHHRWpL7jec",
  authDomain: "agrifarm-ai.firebaseapp.com",
  projectId: "agrifarm-ai",
  storageBucket: "agrifarm-ai.firebasestorage.app",
  messagingSenderId: "1096566696583",
  appId: "1:1096566696583:web:2cdbdb4e03df00bbcb2622",
  measurementId: "G-XBTRT2YHE2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);