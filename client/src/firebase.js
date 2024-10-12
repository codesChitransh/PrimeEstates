// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-webapp-97ab9.firebaseapp.com",
  projectId: "real-estate-webapp-97ab9",
  storageBucket: "real-estate-webapp-97ab9.appspot.com",
  messagingSenderId: "851320799156",
  appId: "1:851320799156:web:486c5051b39fd360533ce1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);