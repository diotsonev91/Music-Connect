import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

/**
 * Listens for authentication state changes
 * @param {function} callback - Function to update auth state
 * @returns {function} Unsubscribe function
 */
export const listenForAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Logs in a user with email & password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<UserCredential>}
 */
export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

/**
 * Registers a new user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<UserCredential>}
 */
export const registerUser = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Logs out the current user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  return await signOut(auth);
};
