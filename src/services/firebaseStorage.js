import { storage } from "./firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

/**
 * Deletes a file from Firebase Storage
 * @param {string} fileUrl - URL of the file to delete
 * @returns {Promise<void>}
 */
export const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;
  
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
    console.log(`File deleted: ${fileUrl}`);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

/**
 * Uploads a file (track, image, background) to Firebase Storage,
 * deleting the old file if a previous URL exists.
 * @param {File} file - File to upload
 * @param {string} path - Storage path (e.g., "tracks", "images")
 * @param {string} oldFileUrl - (Optional) Old file URL to replace
 * @returns {Promise<string>} - URL of uploaded file
 */
export const uploadFile = async (file, path, oldFileUrl = null) => {
  if (!file) return oldFileUrl; // ✅ Return old URL if no new file is uploaded

  // ✅ Only delete old file when updating an existing post
  if (oldFileUrl && oldFileUrl.startsWith("https://")) {
    await deleteFile(oldFileUrl);
  }

  // ✅ Upload new file
  const fileRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
  const uploadTask = uploadBytesResumable(fileRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      null,
      reject,
      async () => {
        const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(fileUrl);
      }
    );
  });
};
