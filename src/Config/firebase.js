// Import the functions you need from the SDKs you need
//config/firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBUZnZp64b5QhcbDY_cbdK6Yj7hzR8OmD4",
  authDomain: "mernauthsystem-ab03d.firebaseapp.com",
  projectId: "mernauthsystem-ab03d",
  storageBucket: "mernauthsystem-ab03d.firebasestorage.app",
  messagingSenderId: "508591526978",
  appId: "1:508591526978:web:c226088aaef4818b16c9db",
  measurementId: "G-1JZ1K6BD0G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();