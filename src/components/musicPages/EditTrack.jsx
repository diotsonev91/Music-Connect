import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useTrackMutation from "../../hooks/useTrackMutation"; // ✅ Use our custom hook
import { useParams } from "react-router-dom";
import TrackForm from "./TrackForm";
import TrackView from "./shared/TrackView";

const EditTrack = ({ onSubmitSuccess }) => {
  const { id } = useParams(); // ✅ Get track ID from URL
  const { user } = useAuth(); // ✅ Get user from AuthContext
  const { saveOrUpdateTrack, fetchTrackById, isLoading, error, message } = useTrackMutation(); // ✅ Use mutation hook

  // ✅ Store the full track object
  const [trackData, setTrackData] = useState(null);

  // ✅ Fetch track by ID first
  useEffect(() => {
    const loadTrack = async () => {
      const track = await fetchTrackById(id); // ✅ Fetch the track by ID
      if (track) {
        setTrackData(track);
      }
    };
    loadTrack();
  }, [id]);

  // ✅ Handle form submission
  const handleSubmit = async (formData) => {
    if (!user) return;

    const result = await saveOrUpdateTrack(formData, user, id);
    if (result.success) {
      onSubmitSuccess && onSubmitSuccess();
    }
  };

  return trackData ? (
    <div>
      <h1>Edit Track</h1>

      {/* ✅ Render TrackPage with Full Track Data */}
      <TrackView track={trackData} />

      {/* ✅ Pass Full Track Data to Form */}
      <TrackForm 
        initialData={trackData} 
        onSubmit={handleSubmit} 
        loading={isLoading} 
        setTrackData={setTrackData} // ✅ Update trackData dynamically
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  ) : <p>Loading...</p>;
};

export default EditTrack;
