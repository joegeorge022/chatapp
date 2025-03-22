import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDaAdsZdV22qpNyekUSx3y8BG4j_Xcqzu8",
  authDomain: "trial-chatapp-db72e.firebaseapp.com",
  projectId: "trial-chatapp-db72e",
  storageBucket: "trial-chatapp-db72e.firebasestorage.app",
  messagingSenderId: "34043981247",
  appId: "1:34043981247:web:ccfa7c53307e429337050a",
  measurementId: "G-9TS00E4PS1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
