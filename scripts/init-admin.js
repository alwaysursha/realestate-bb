// This script initializes the admin user in Firebase
const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} = require('firebase/auth');
const { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} = require('firebase/firestore');

// Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);

// Admin user details
const adminEmail = 'teamalisyed@gmail.com';
const adminPassword = 'Aliteam123!!';
const adminName = 'Admin User';

async function initializeAdmin() {
  try {
    console.log(`Checking if admin user (${adminEmail}) already exists...`);
    
    try {
      // Try to sign in with the admin credentials
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log('Admin user already exists and credentials are valid.');
      
      // Get the current user
      const user = auth.currentUser;
      
      // Check if the user document exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        console.log('Admin user document already exists in Firestore.');
        
        // Update the role to ensure it's admin
        if (userDoc.data().role !== 'admin') {
          await setDoc(userRef, { role: 'admin' }, { merge: true });
          console.log('Updated user role to admin.');
        }
      } else {
        console.log('Creating admin user document in Firestore...');
        
        // Create the user document
        await setDoc(userRef, {
          id: user.uid,
          name: adminName,
          email: adminEmail,
          role: 'admin',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
        
        console.log('Admin user document created successfully.');
      }
    } catch (signInError) {
      console.log('Admin user does not exist or credentials are invalid. Creating new admin user...');
      
      // Create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      const user = userCredential.user;
      
      // Update profile with name
      await updateProfile(user, { displayName: adminName });
      
      // Create user document in Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        id: user.uid,
        name: adminName,
        email: adminEmail,
        role: 'admin',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      
      console.log('Admin user created successfully.');
    }
    
    console.log('Admin initialization completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing admin user:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeAdmin(); 