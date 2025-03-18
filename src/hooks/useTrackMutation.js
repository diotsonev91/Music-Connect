import { useState } from "react";
import { db } from "../services/firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import useMutation from "./useMutation";
import { uploadFile, deleteFile } from "../services/firebaseStorage";
import { addDocument, updateDocument, deleteDocument } from "../services/firebaseFirestore";

export default function useTrackMutation() {
  const { mutate: upload, isLoading: isUploading, error: uploadError } = useMutation(uploadFile);
  const { mutate: saveTrack, isLoading: isSaving, error: saveError } = useMutation((data) => addDocument("tracks", data));
  const { mutate: update, isLoading: isUpdating, error: updateError } = useMutation((data) => updateDocument("tracks", data.id, data));
  const { mutate: removeTrack, isLoading: isDeleting, error: deleteError } = useMutation((id) => deleteDocument("tracks", id));

  const [message, setMessage] = useState("");

  // ✅ Upload or Update a Track
  const saveOrUpdateTrack = async (formData, user, trackId = null) => {
    if (!user) {
      setMessage("User not logged in.");
      return { success: false, error: "User not logged in." };
    }

    try {
      let trackFileUrl = formData.trackFileUrl;
      if (formData.trackFile instanceof File) {
        trackFileUrl = await upload(formData.trackFile, "tracks", formData.trackFileUrl);
      }

      let trackImageUrl = formData.trackImageUrl;
      if (formData.trackImage instanceof File) {
        trackImageUrl = await upload(formData.trackImage, "track_images", formData.trackImageUrl);
      }

      let backgroundImageUrl = formData.backgroundImageUrl;
      if (formData.backgroundImage instanceof File) {
        backgroundImageUrl = await upload(formData.backgroundImage, "background_images", formData.backgroundImageUrl);
      }

      const trackData = {
        trackName: formData.trackName,
        genre: formData.genre.toLowerCase(),
        trackFileUrl,
        trackImageUrl,
        backgroundImageUrl,
        author: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Anonymous",
        },
        createdAt: new Date(),
      };

      if (trackId) {
        await update({ id: trackId, ...trackData });
        setMessage("Track updated successfully!");
      } else {
        await saveTrack(trackData);
        setMessage("Track uploaded successfully!");
      }

      return { success: true };
    } catch (error) {
      setMessage("Error: " + error.message);
      return { success: false, error: error.message };
    }
  };

  // ✅ Fetch tracks by playlist (genre)
  const fetchTracksByPlaylist = async (playlistTitle) => {
    try {
      const q = query(
        collection(db, "tracks"),
        where("genre", "==", playlistTitle)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      setMessage("Error fetching tracks by playlist: " + error.message);
      return [];
    }
  };

  // ✅ Fetch tracks by user ID
  const fetchTracksByUser = async (userId) => {
    try {
      const q = query(
        collection(db, "tracks"),
        where("author.uid", "==", userId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      setMessage("Error fetching user tracks: " + error.message);
      return [];
    }
  };

  // ✅ Fetch a single track by ID
  const fetchTrackById = async (trackId) => {
    try {
      const docRef = doc(db, "tracks", trackId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      setMessage("Error fetching track: " + error.message);
      return null;
    }
  };

  // ✅ Delete Track & Associated Files
  const deleteTrackWithFiles = async (trackId, trackFileUrl, trackImageUrl, backgroundImageUrl) => {
    try {
      if (trackFileUrl) await deleteFile(trackFileUrl);
      if (trackImageUrl) await deleteFile(trackImageUrl);
      if (backgroundImageUrl) await deleteFile(backgroundImageUrl);

      await removeTrack(trackId);
      setMessage("Track deleted successfully!");
      return { success: true };
    } catch (error) {
      setMessage("Error deleting track: " + error.message);
      return { success: false, error: error.message };
    }
  };

  return {
    saveOrUpdateTrack,
    fetchTracksByPlaylist,
    fetchTracksByUser,
    fetchTrackById,
    deleteTrackWithFiles,
    isLoading: isUploading || isSaving || isUpdating || isDeleting,
    error: uploadError || saveError || updateError || deleteError,
    message,
  };
}
