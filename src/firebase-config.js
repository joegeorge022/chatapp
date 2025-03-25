// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaAdsZdV22qpNyekUSx3y8BG4j_Xcqzu8",
  authDomain: "trial-chatapp-db72e.firebaseapp.com",
  projectId: "trial-chatapp-db72e",
  storageBucket: "trial-chatapp-db72e.firebasestorage.app",
  messagingSenderId: "34043981247",
  appId: "1:34043981247:web:ccfa7c53307e429337050a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.useDeviceLanguage();
export const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  display: 'popup',
  prompt: 'select_account'
});
export const db = getFirestore(app);
