import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { fetchTrack, updateTrack } from "../../services/firebaseTrackService";
import { uploadFile } from "../../services/firebaseStorage";
import TrackForm from "./TrackForm";
import TrackPage from "./TrackPage";
import { useParams } from "react-router-dom";

const EditTrack = ({ onSubmitSuccess }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [trackData, setTrackData] = useState(null);
  const [trackImageURL, setTrackImageURL] = useState("");
  const [backgroundImageURL, setBackgroundImageURL] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadTrack = async () => {
      const data = await fetchTrack(id);
      if (data) {
        setTrackData(data);
        setTrackImageURL(data.trackImageUrl || "");
        setBackgroundImageURL(data.backgroundImageUrl || "");
      }
    };
    loadTrack();
  }, [id]);

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

      await updateTrack(id, { ...formData, trackFileUrl, trackImageUrl, backgroundImageUrl });

      setMessage("Track updated successfully!");
      onSubmitSuccess && onSubmitSuccess();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
    setLoading(false);
  };

  return trackData ? (
    <div>
      <h1>Edit Track</h1>

      {/* ✅ Render TrackPage with preview images */}
      <TrackPage 
        showComments={false} 
        trackImageURL={trackImageURL} 
        backgroundImageURL={backgroundImageURL} 
      />

      {/* ✅ Pass preview handlers & existing track data to TrackForm */}
      <TrackForm 
        initialData={trackData} 
        onSubmit={handleSubmit} 
        loading={loading} 
        setTrackImageURL={setTrackImageURL} 
        setBackgroundImageURL={setBackgroundImageURL} 
      />

      {message && <p>{message}</p>}
    </div>
  ) : <p>Loading...</p>;
};

export default EditTrack;
