import { useState } from "react";
import useMutation from "./useMutation";
import { uploadFile, deleteFile } from "../services/firebaseStorage";
import { addDocument, updateDocument, deleteDocument, fetchCollection, fetchDocument } from "../services/firebaseFirestore";

export default function useTrackMutation() {
  const { mutate: upload, isLoading: isUploading, error: uploadError } = useMutation(uploadFile);
  const { mutate: saveTrack, isLoading: isSaving, error: saveError } = useMutation((data) => addDocument("tracks", data));
  const { mutate: update, isLoading: isUpdating, error: updateError } = useMutation((data) => updateDocument("tracks", data.id, data));
  const { mutate: removeTrack, isLoading: isDeleting, error: deleteError } = useMutation((id) => deleteDocument("tracks", id));
  const { mutate: fetchTracks, isLoading: isFetching, error: fetchError } = useMutation(() => fetchCollection("tracks"));
  const [message, setMessage] = useState("");

  // ✅ Upload or Update a Track
  const saveOrUpdateTrack = async (formData, user, trackId = null) => {
    if (!user) {
      setMessage("User not logged in.");
      return { success: false, error: "User not logged in." };
    }

    try {
      // ✅ Upload files (or reuse existing URLs)
      const trackFileUrl = formData.trackFile ? await upload(formData.trackFile, "tracks") : formData.trackFileUrl;
      const trackImageUrl = formData.trackImage ? await upload(formData.trackImage, "track_images") : formData.trackImageUrl;
      const backgroundImageUrl = formData.backgroundImage ? await upload(formData.backgroundImage, "background_images") : formData.backgroundImageUrl;

      const trackData = {
        ...formData,
        trackFileUrl,
        trackImageUrl,
        backgroundImageUrl,
        author: { uid: user.uid, email: user.email, displayName: user.displayName || "Anonymous" },
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

  // ✅ Fetch tracks by playlist title
  const fetchTracksByPlaylist = async (playlistTitle) => {
    try {
      const allTracks = await fetchTracks();
      return allTracks.filter((track) => track.playlist === playlistTitle);
    } catch (error) {
      setMessage("Error fetching tracks: " + error.message);
      return [];
    }
  };

  // ✅ Fetch a single track by ID
  const fetchTrackById = async (trackId) => {
    try {
      return await fetchDocument("tracks", trackId);
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
    fetchTrackById, // ✅ New method
    deleteTrackWithFiles,
    isLoading: isUploading || isSaving || isUpdating || isFetching || isDeleting,
    error: uploadError || saveError || updateError || deleteError || fetchError,
    message,
  };
}
