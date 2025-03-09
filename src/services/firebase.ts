import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export the app instance
export default app; 