import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { createTrack } from "../../services/firebaseTrackService";
import { uploadFile } from "../../services/firebaseStorage";
import TrackForm from "./TrackForm";
import TrackPage from "./TrackPage";

const UploadTrack = ({ onSubmitSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [trackImageURL, setTrackImageURL] = useState("");
  const [backgroundImageURL, setBackgroundImageURL] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (formData) => {
    if (!user) {
      setMessage("User not logged in.");
      return;
    }

    setLoading(true);
    try {
      const trackFileUrl = formData.trackFile ? await uploadFile(formData.trackFile, "tracks") : formData.trackFileUrl;
      const trackImageUrl = formData.trackImage ? await uploadFile(formData.trackImage, "track_images") : formData.trackImageUrl;
      const backgroundImageUrl = formData.backgroundImage ? await uploadFile(formData.backgroundImage, "background_images") : formData.backgroundImageUrl;

      await createTrack({
        ...formData,
        trackFileUrl,
        trackImageUrl,
        backgroundImageUrl,
        author: { uid: user.uid, email: user.email, displayName: user.displayName || "Anonymous" },
      });

      setMessage("Track uploaded successfully!");
      onSubmitSuccess && onSubmitSuccess();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Upload a New Track</h1>

      {/* ✅ Render TrackPage with preview images */}
      <TrackPage 
        showComments={false} 
        trackImageURL={trackImageURL} 
        backgroundImageURL={backgroundImageURL} 
      />

      {/* ✅ Pass preview handlers to TrackForm */}
      <TrackForm 
        onSubmit={handleSubmit} 
        loading={loading} 
        setTrackImageURL={setTrackImageURL} 
        setBackgroundImageURL={setBackgroundImageURL} 
      />
      
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadTrack;
