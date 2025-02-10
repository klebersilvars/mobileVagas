import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyBc4_Z6ksRt4jTOtxgxHUFPnKR8BjECWiQ",
    authDomain: "novostalentos-84288.firebaseapp.com",
    projectId: "novostalentos-84288",
    storageBucket: "novostalentos-84288.firebasestorage.app",
    messagingSenderId: "92784366742",
    appId: "1:92784366742:web:aacc3206f0175f47365eb7",
    measurementId: "G-8B34YSCVM8"
};

// Verifica se já existe uma instância do Firebase antes de inicializar
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Inicializa o Firebase Auth com persistência
const auth = getApps().length === 0
  ? initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    })
  : getAuth(app);

// Inicialize o Firestore
export const db = getFirestore(app);
export { auth };
