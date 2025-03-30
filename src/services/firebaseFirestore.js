import { db } from "./firebaseConfig";
import { doc, setDoc, updateDoc, deleteDoc, collection, getDocs, getDoc, addDoc,serverTimestamp } from "firebase/firestore";

/**
 * Adds a new document to a Firestore collection
 * @param {string} collectionName - Firestore collection name
 * @param {object} data - Document data
 * @returns {Promise<string>} - Document ID of the new document
 */
export const addDocument = async (collectionName, data) => {
  console.log("🔥 Firestore Payload Before Sending:", JSON.stringify(data, null, 2));

  try {
    // ✅ Force Firestore to use the correct path
    const docRef = doc(collection(db, collectionName)); // Generates an ID
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(), // ✅ Ensure Firestore handles timestamps properly
    });

    console.log("✅ Document successfully written! ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Firestore Write Error:", error);
    throw error;
  }
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

/**
 * Sets a document with a specific ID in a Firestore collection (creates or overwrites).
 * @param {string} collectionPath - Firestore collection path (e.g., "blogs/blogId/views")
 * @param {string} docId - The document ID to set (e.g., userId)
 * @param {object} data - Document data to write
 * @param {boolean} merge - Whether to merge with existing data (default: false)
 * @returns {Promise<void>}
 */
export const setDocument = async (collectionPath, docId, data, merge = false) => {
  const docRef = doc(db, collectionPath, docId);
  await setDoc(docRef, data, { merge });
};