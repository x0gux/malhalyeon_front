import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDz20SSKOJZTyIYaO6fAKcNlo0cbx-bzR4",
  authDomain: "malhalyeon-project.firebaseapp.com",
  projectId: "malhalyeon-project",
  storageBucket: "malhalyeon-project.firebasestorage.app",
  messagingSenderId: "733340197258",
  appId: "1:733340197258:web:eb6f81983a06e079dfa873",
  measurementId: "G-SJC0JZB8EH"
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
