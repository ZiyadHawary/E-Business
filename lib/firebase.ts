// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANNVmIfmOh5G2W9WcuKx4C4Jb4hAuSHck",
  authDomain: "e-business-f1529.firebaseapp.com",
  projectId: "e-business-f1529",
  storageBucket: "e-business-f1529.firebasestorage.app",
  messagingSenderId: "386374109962",
  appId: "1:386374109962:web:ebf234c0e626559e9b08f3",
  measurementId: "G-6Q2FHH0SQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);