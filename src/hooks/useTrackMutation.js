import { useState } from "react";
import { db } from "../services/firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc,  orderBy, limit } from "firebase/firestore";
import useMutation from "./useMutation";
import { uploadFile, deleteFile } from "../services/firebaseStorage";
import { addDocument, updateDocument, deleteDocument, setDocument, fetchDocument, fetchCollection } from "../services/firebaseFirestore";

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
        return { success: true, id: trackId }; // ✅ return the existing id
      } else {
        const newTrackId = await saveTrack(trackData); // Make sure saveTrack returns the new ID
        setMessage("Track uploaded successfully!");
        return { success: true, id: newTrackId }; // ✅ return the new id
      }
    } catch (error) {
      setMessage("Error: " + error.message);
      return { success: false, error: error.message };
    }
  };
  

  // ✅ Fetch tracks by playlist (genre)
  const fetchTracksByPlaylist = async (playlistTitle, user) => {
    try {
      let q;
  
      // 🧡 Fetch liked tracks by current user
      if (playlistTitle === "myPlaylist" && user?.uid) {
        const likedTracksSnapshot = await getDocs(collection(db, "tracks"));
        const likedTracks = [];
  
        for (const docSnap of likedTracksSnapshot.docs) {
          const likeDoc = await getDoc(doc(db, `tracks/${docSnap.id}/likes`, user.uid));
          if (likeDoc.exists()) {
            likedTracks.push({ id: docSnap.id, ...docSnap.data() });
          }
        }
  
        return likedTracks;
      }
  
      //  Fetch uploaded tracks by current user
      if (playlistTitle === "myUploads" && user?.uid) {
        q = query(collection(db, "tracks"), where("author.uid", "==", user.uid));
      }
  
      //  Fetch newest tracks (latest 5)
      else if (playlistTitle === "newTracks") {
        q = query(collection(db, "tracks"), orderBy("createdAt", "desc"), limit(15));
      }
  
      // Fetch by genre
      else {
        q = query(collection(db, "tracks"), where("genre", "==", playlistTitle));
      }
  
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
    } catch (error) {
      setMessage("Error fetching tracks: " + error.message);
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

  // Track a user view on a track
const trackUserViewOnTrack = async (trackId, userId) => {
  try {
    const viewPath = `tracks/${trackId}/views`;
    const viewDoc = await fetchDocument(viewPath, userId); // Check if viewed
    if (!viewDoc) {
      await setDocument(viewPath, userId, { viewedAt: new Date() });
    }
  } catch (error) {
    setMessage("Error tracking track view: " + error.message);
  }
};

// Fetch total views of a track
const fetchTrackViews = async (trackId) => {
  try {
    const views = await fetchCollection(`tracks/${trackId}/views`);
    return views.length;
  } catch (error) {
    setMessage("Error fetching track views: " + error.message);
    return 0;
  }
};


   // ✅ Add a comment to a specific track
   const addCommentToTrack = async (trackId, user, commentText, time = null) => {
    if (!user?.uid) return { success: false, error: "User not logged in" };
  
    try {
      const commentData = {
        text: commentText,
        time, // optional timestamp for audio
        author: {
          uid: user.uid,
          displayName: user.displayName || "Anonymous",
          email: user.email || "",
        },
        createdAt: new Date(),
      };
  
      await addDocument(`tracks/${trackId}/comments`, commentData);
      setMessage("Comment added successfully!");
      return { success: true };
    } catch (error) {
      setMessage("Error adding comment: " + error.message);
      return { success: false, error: error.message };
    }
  };

 // ✅ Edit Comment
const updateCommentOnTrack = async (trackId, commentId, updatedData) => {
  try {
    await updateDocument(`tracks/${trackId}/comments`, commentId, {
      ...updatedData,
      updatedAt: new Date(),
    });
    setMessage("Comment updated successfully!");
    return { success: true };
  } catch (error) {
    setMessage("Error updating comment: " + error.message);
    return { success: false, error: error.message };
  }
};

// ✅ Delete Comment
const deleteCommentFromTrack = async (trackId, commentId) => {
  try {
    await deleteDocument(`tracks/${trackId}/comments`, commentId);
    setMessage("Comment deleted successfully!");
    return { success: true };
  } catch (error) {
    setMessage("Error deleting comment: " + error.message);
    return { success: false, error: error.message };
  }
};

// ✅ Fetch Comments
const fetchTrackComments = async (trackId) => {
  try {
    const comments = await fetchCollection(`tracks/${trackId}/comments`);
    return comments;
  } catch (error) {
    setMessage("Error fetching comments: " + error.message);
    return [];
  }
};

// ✅ Toggle Like / Unlike Track
const toggleTrackLike = async (trackId, user) => {
  if (!user?.uid) return { success: false, error: "User not logged in" };

  const likePath = `tracks/${trackId}/likes`;
  try {
    // ✅ Check if user already liked
    const existingLike = await fetchDocument(likePath, user.uid);

    if (existingLike) {
      // ✅ Unlike
      await deleteDocument(likePath, user.uid);
      setMessage("Like removed");
      return { success: true, action: "unliked" };
    } else {
      // ✅ Like
      await setDocument(likePath, user.uid, {
        likedAt: new Date(),
        userId: user.uid,
        displayName: user.displayName || "Anonymous",
      });
      setMessage("Track liked!");
      return { success: true, action: "liked" };
    }
  } catch (error) {
    setMessage("Error toggling like: " + error.message);
    return { success: false, error: error.message };
  }
};

// ✅ Fetch number of likes
const fetchTrackLikes = async (trackId) => {
  try {
    const likes = await fetchCollection(`tracks/${trackId}/likes`);
    return likes.length;
  } catch (error) {
    setMessage("Error fetching likes: " + error.message);
    return 0;
  }
};

const fetchTopRatedTracks = async () => {
  try {
    const tracksSnapshot = await getDocs(collection(db, "tracks"));
    const tracksWithLikes = [];

    for (const docSnap of tracksSnapshot.docs) {
      const trackId = docSnap.id;
      const likes = await fetchCollection(`tracks/${trackId}/likes`);
      if (likes.length > 0) {
        tracksWithLikes.push({
          id: trackId,
          ...docSnap.data(),
          likesCount: likes.length,
        });
      }
    }

    // Sort tracks by likes in descending order
    return tracksWithLikes.sort((a, b) => b.likesCount - a.likesCount);
  } catch (error) {
    setMessage("Error fetching top rated tracks: " + error.message);
    return [];
  }
};


  return {
    saveOrUpdateTrack,
    fetchTracksByPlaylist,
    fetchTracksByUser,
    fetchTrackById,
    addCommentToTrack,  
    updateCommentOnTrack,
    deleteCommentFromTrack,   
    fetchTrackComments,  
    deleteTrackWithFiles,
    toggleTrackLike,
    trackUserViewOnTrack,
  fetchTrackViews,
    fetchTrackLikes,
    fetchTopRatedTracks,
    isLoading: isUploading || isSaving || isUpdating || isDeleting,
    error: uploadError || saveError || updateError || deleteError,
    message,
  };
}
