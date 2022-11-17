// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVkmP23CfmTuvZ21uE2w3wrO7gQStANjQ",
  authDomain: "medscrape-test.firebaseapp.com",
  projectId: "medscrape-test",
  storageBucket: "medscrape-test.appspot.com",
  messagingSenderId: "336440287990",
  appId: "1:336440287990:web:b94c12785e0adec88142d7",
  measurementId: "G-D1W5E84XJ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app