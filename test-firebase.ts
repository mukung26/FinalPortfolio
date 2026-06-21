import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

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
const db = getFirestore(app);

async function test() {
  try {
    const statsRef = doc(db, 'stats', 'visitors');
    console.log("Getting doc...");
    const snap = await getDoc(statsRef);
    console.log("Exists:", snap.exists());
    if (snap.exists()) {
      console.log("Count:", snap.data().count);
    } else {
        console.log("Setting doc...");
        await setDoc(statsRef, { count: 1 });
        console.log("Set successfully");
    }
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}
test();
