import { getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvX4-bPOjZBSmiomKo7fhANI2Qj36zEbU",
  authDomain: "realestatedxbali.firebaseapp.com",
  projectId: "realestatedxbali",
  storageBucket: "realestatedxbali.appspot.com",
  messagingSenderId: "1069388318638",
  appId: "1:1069388318638:web:af796425af4a7e87b8ea3f"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Export the app instance
export default app; 