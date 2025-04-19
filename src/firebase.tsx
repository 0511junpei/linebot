// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1Av-Ts9hluwRQ9rTosmqcM8_tUqARo8o",
  authDomain: "myapp-692de.firebaseapp.com",
  projectId: "myapp-692de",
  storageBucket: "myapp-692de.firebasestorage.app",
  messagingSenderId: "846211976276",
  appId: "1:846211976276:web:57fe2acf258454c54d71c1",
  measurementId: "G-SJ5JGFKKS4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
