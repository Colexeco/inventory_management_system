// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1TIXHCKcnLwwa-ETFWotZ-QmDPIpLGNc",
  authDomain: "inventory-management-sys-f8870.firebaseapp.com",
  projectId: "inventory-management-sys-f8870",
  storageBucket: "inventory-management-sys-f8870.appspot.com",
  messagingSenderId: "322811984085",
  appId: "1:322811984085:web:84ce5431eff991cf098a5c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)
export {firestore}