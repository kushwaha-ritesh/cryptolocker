// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAw89dbFjgTqnM1cCqMua6ia6jqVkBStt8",
  authDomain: "rupeelocker.firebaseapp.com",
  projectId: "rupeelocker",
  storageBucket: "rupeelocker.firebasestorage.app",
  messagingSenderId: "481920793711",
  appId: "1:481920793711:web:47f34deb74d51a9754a19a",
  measurementId: "G-TGX9DZYVLT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error("Google Sign-in Error:", err);
    throw err; // Rethrow the error so it can be caught by the component
  }
};

export const signUpWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (err) {
    console.error(err);
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (err) {
    console.error(err);
  }
};
