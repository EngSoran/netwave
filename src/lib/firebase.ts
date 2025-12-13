
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDMXsw11dST4GAAQ2C0kP6Pba2GFUPkZUs",
  authDomain: "netwave-53c33.firebaseapp.com",
  projectId: "netwave-53c33",
  storageBucket: "netwave-53c33.firebasestorage.app",
  messagingSenderId: "221740856109",
  appId: "1:221740856109:web:9fb63cf3abadcd1e2359a4",
  measurementId: "G-HYWK8SCF8Y"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
import { getAnalytics, isSupported } from "firebase/analytics";
let analytics: ReturnType<typeof getAnalytics> | undefined = undefined;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, googleProvider, analytics };

