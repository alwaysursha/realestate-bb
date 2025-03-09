// Mock auth service for static deployment
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  User
} from "firebase/auth";
import { auth } from "./firebase";

// Interface for user data
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  lastLogin?: Date;
  phone?: string;
  profileImageUrl?: string;
}

// Register a new user
export const registerUser = async (
  email: string, 
  password: string, 
  name: string, 
  role: string = "user",
  phone?: string
): Promise<UserData> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with name
    await updateProfile(user, { displayName: name });
    
    // Create user data object
    const userData: UserData = {
      id: user.uid,
      name,
      email,
      role,
      createdAt: new Date(),
      lastLogin: new Date(),
      phone
    };
    
    return userData;
  } catch (error: any) {
    console.error("Error registering user:", error);
    throw new Error(error.message || "Failed to register user");
  }
};

// Login a user
export const loginUser = async (email: string, password: string): Promise<UserData> => {
  try {
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user data object
    const userData: UserData = {
      id: user.uid,
      name: user.displayName || "User",
      email: user.email || email,
      role: email === "teamalisyed@gmail.com" ? "admin" : "user",
      createdAt: new Date(),
      lastLogin: new Date()
    };
    
    return userData;
  } catch (error: any) {
    console.error("Error logging in:", error);
    throw new Error(error.message || "Failed to login");
  }
};

// Logout a user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error logging out:", error);
    throw new Error(error.message || "Failed to logout");
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Error resetting password:", error);
    throw new Error(error.message || "Failed to send password reset email");
  }
};

// Get current user data
export const getCurrentUser = async (): Promise<UserData | null> => {
  const user = auth.currentUser;
  
  if (!user) return null;
  
  return {
    id: user.uid,
    name: user.displayName || "User",
    email: user.email || "",
    role: user.email === "teamalisyed@gmail.com" ? "admin" : "user",
    createdAt: new Date(),
    lastLogin: new Date()
  };
}; 