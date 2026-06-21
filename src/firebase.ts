import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtjcHjhWjqGFQEfKio1etIxXe28lwDFoc",
  authDomain: "portfolio-dded3.firebaseapp.com",
  projectId: "portfolio-dded3",
  storageBucket: "portfolio-dded3.firebasestorage.app",
  messagingSenderId: "789528461532",
  appId: "1:789528461532:web:9cb39413f3110c07b9b419",
  measurementId: "G-JX6SDYYQH5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
