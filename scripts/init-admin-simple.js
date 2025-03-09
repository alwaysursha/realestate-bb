// This script initializes the admin user in Firebase with simpler security rules
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
  serverTimestamp,
  collection,
  addDoc
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

// Sample data to initialize the database
const sampleProperty = {
  title: "Luxury Villa in Palm Jumeirah",
  description: "Beautiful 5-bedroom villa with private beach access",
  price: 15000000,
  location: "Palm Jumeirah, Dubai",
  bedrooms: 5,
  bathrooms: 6,
  area: 10000,
  propertyType: "Villa",
  status: "For Sale",
  features: ["Private Pool", "Beach Access", "Smart Home", "Gym"],
  images: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1475&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  ],
  featured: true,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
};

const sampleDeveloper = {
  name: "Emaar Properties",
  description: "Leading developer in Dubai known for iconic projects like Burj Khalifa",
  logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/73/Emaar_Properties_logo.svg/1200px-Emaar_Properties_logo.svg.png",
  website: "https://www.emaar.com",
  email: "info@emaar.com",
  phone: "+971 4 888 8888",
  address: "Dubai, UAE",
  establishedYear: 1997,
  featured: true,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
};

const sampleAgent = {
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "+971 50 123 4567",
  bio: "Experienced real estate agent specializing in luxury properties",
  specialization: ["Luxury Villas", "Apartments", "Commercial"],
  profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
  active: true,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
};

async function initializeAdmin() {
  try {
    console.log(`Checking if admin user (${adminEmail}) already exists...`);
    
    let user;
    
    try {
      // Try to sign in with the admin credentials
      const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      user = userCredential.user;
      console.log('Admin user already exists and credentials are valid.');
    } catch (signInError) {
      console.log('Admin user does not exist or credentials are invalid. Creating new admin user...');
      
      // Create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      user = userCredential.user;
      
      // Update profile with name
      await updateProfile(user, { displayName: adminName });
      console.log('Admin user created successfully.');
    }
    
    // Create or update user document in Firestore
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        id: user.uid,
        name: adminName,
        email: adminEmail,
        role: 'admin',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      console.log('Admin user document created/updated in Firestore.');
    } catch (firestoreError) {
      console.error('Error creating/updating user document:', firestoreError);
    }
    
    // Add sample data
    try {
      // Add sample property
      const propertyRef = await addDoc(collection(db, "properties"), sampleProperty);
      console.log('Sample property added with ID:', propertyRef.id);
      
      // Add sample developer
      const developerRef = await addDoc(collection(db, "developers"), sampleDeveloper);
      console.log('Sample developer added with ID:', developerRef.id);
      
      // Add sample agent
      const agentRef = await addDoc(collection(db, "agents"), sampleAgent);
      console.log('Sample agent added with ID:', agentRef.id);
    } catch (sampleDataError) {
      console.error('Error adding sample data:', sampleDataError);
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