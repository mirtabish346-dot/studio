
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "studio-4150980844-f7c6c",
  "appId": "1:807106788155:web:55f5b44e0e76e579f1151e",
  "storageBucket": "studio-4150980844-f7c6c.firebasestorage.app",
  "apiKey": "AIzaSyA8rO1tf93-cOxV1r1ig2R35bjNRgyRDxQ",
  "authDomain": "studio-4150980844-f7c6c.firebaseapp.com",
  "messagingSenderId": "807106788155"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
