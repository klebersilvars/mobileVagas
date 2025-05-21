import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBc4_Z6ksRt4jTOtxgxHUFPnKR8BjECWiQ",
  authDomain: "novostalentos-84288.firebaseapp.com",
  projectId: "novostalentos-84288",
  storageBucket: "novostalentos-84288.firebasestorage.app",
  messagingSenderId: "92784366742",
  appId: "1:92784366742:web:aacc3206f0175f47365eb7",
  measurementId: "G-8B34YSCVM8"
};

// Inicializa o Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
