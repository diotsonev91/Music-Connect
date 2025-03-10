import { db } from "./firebaseConfig";
import { doc, setDoc, updateDoc, deleteDoc, collection, getDocs, getDoc } from "firebase/firestore";

/**
 * Saves a new user in Firestore (Creates or Updates)
 * @param {string} userId - User ID
 * @param {object} userData - User data
 * @returns {Promise<void>}
 */
export const saveUser = async (userId, userData) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, userData, { merge: true }); // ✅ Merge existing data
};

/**
 * Updates an existing Firestore document
 * @param {string} collectionName - Firestore collection name
 * @param {string} docId - Document ID
 * @param {object} data - Data to update
 * @returns {Promise<void>}
 */
export const updateDocument = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, data);
};

/**
 * Deletes a document from Firestore
 * @param {string} collectionName - Firestore collection name
 * @param {string} docId - Document ID
 * @returns {Promise<void>}
 */
export const deleteDocument = async (collectionName, docId) => {
  await deleteDoc(doc(db, collectionName, docId));
};

/**
 * Fetches all documents from a Firestore collection
 * @param {string} collectionName - Firestore collection name
 * @returns {Promise<object[]>} - Array of documents
 */
export const fetchCollection = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Fetches a single document from Firestore
 * @param {string} collectionName - Firestore collection name
 * @param {string} docId - Document ID
 * @returns {Promise<object | null>} - Document data or null if not found
 */
export const fetchDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};
