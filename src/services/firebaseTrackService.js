import { db } from "./firebaseConfig";
import { collection, addDoc, updateDoc, doc, getDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

/**
 * Creates a new track document in Firestore.
 * @param {object} trackData - The track data to save.
 * @returns {Promise<string>} - The ID of the created track.
 */
export const createTrack = async (trackData) => {
  const trackRef = await addDoc(collection(db, "tracks"), {
    ...trackData,
    createdAt: serverTimestamp(),
  });
  return trackRef.id;
};

/**
 * Fetches a track document by ID from Firestore.
 * @param {string} trackId - The track ID.
 * @returns {Promise<object|null>} - The track data or null if not found.
 */
export const fetchTrack = async (trackId) => {
  const trackRef = doc(db, "tracks", trackId);
  const trackSnap = await getDoc(trackRef);
  return trackSnap.exists() ? { id: trackSnap.id, ...trackSnap.data() } : null;
};

/**
 * Updates an existing track document in Firestore.
 * @param {string} trackId - The track ID.
 * @param {object} trackData - The updated track data.
 * @returns {Promise<void>}
 */
export const updateTrack = async (trackId, trackData) => {
  const trackRef = doc(db, "tracks", trackId);
  await updateDoc(trackRef, {
    ...trackData,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Deletes a track document from Firestore.
 * @param {string} trackId - The track ID.
 * @returns {Promise<void>}
 */
export const deleteTrack = async (trackId) => {
  const trackRef = doc(db, "tracks", trackId);
  await deleteDoc(trackRef);
};
