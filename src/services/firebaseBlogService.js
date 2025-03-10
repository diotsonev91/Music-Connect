import { db } from "./firebaseConfig";
import { doc, setDoc, updateDoc, deleteDoc, collection, addDoc, getDoc, getDocs } from "firebase/firestore";

/**
 * Creates a new blog post in Firestore
 * @param {object} blogData - Blog post data
 * @returns {Promise<string>} - Document ID of the new blog
 */
export const createBlogPost = async (blogData) => {
  const docRef = await addDoc(collection(db, "blogs"), {
    ...blogData,
    createdAt: new Date(),
  });
  return docRef.id;
};

/**
 * Updates an existing blog post
 * @param {string} blogId - ID of the blog post
 * @param {object} blogData - Updated blog data
 * @returns {Promise<void>}
 */
export const updateBlogPost = async (blogId, blogData) => {
  const docRef = doc(db, "blogs", blogId);
  await updateDoc(docRef, {
    ...blogData,
    updatedAt: new Date(),
  });
};

/**
 * Fetches a single blog post by ID
 * @param {string} blogId - Blog post ID
 * @returns {Promise<object | null>} - Blog post data or null if not found
 */
export const fetchBlogPost = async (blogId) => {
  const docRef = doc(db, "blogs", blogId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

/**
 * Fetches all blog posts
 * @returns {Promise<object[]>} - Array of all blog posts
 */
export const getAllBlogs = async () => {
  const querySnapshot = await getDocs(collection(db, "blogs"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Deletes a blog post
 * @param {string} blogId - ID of the blog post to delete
 * @returns {Promise<void>}
 */
export const deleteBlogPost = async (blogId) => {
  await deleteDoc(doc(db, "blogs", blogId));
};
