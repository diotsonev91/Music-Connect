import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useTrackMutation from "../../hooks/useTrackMutation"; // ✅ Use our custom hook
import TrackForm from "./TrackForm";
import TrackView from "./shared/TrackView";

const UploadTrack = ({ onSubmitSuccess }) => {
  const { user } = useAuth(); // ✅ Get user from AuthContext
  const { saveOrUpdateTrack, isLoading, error, message } = useTrackMutation(); // ✅ Use our mutation hook

  // ✅ Store the full track object
  const [trackData, setTrackData] = useState({
    trackName: "",
    genre: "",
    trackFile: null,
    trackFileUrl: "",
    trackImage: null,
    trackImageUrl: "",
    backgroundImage: null,
    backgroundImageUrl: "",
    author: user
      ? { uid: user.uid, email: user.email, displayName: user.displayName || "Anonymous" }
      : {},
  });

  // ✅ Handle form submission
  const handleSubmit = async () => {
    console.log("✅ FULL trackData at submit: ", trackData);
    const result = await saveOrUpdateTrack(trackData, user);  // ✅ Use full trackData
  };
  

  return (
    <div>
      <h1>Upload a New Track</h1>

      {/* ✅ Show Preview with Full Track Object */}
      <TrackView track={trackData}/>

      {/* ✅ Pass track state to TrackForm */}
      <TrackForm 
        initialData={trackData} 
        onSubmit={handleSubmit} 
        loading={isLoading} 
        setTrackData={setTrackData} // ✅ Update trackData on input changes
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadTrack;
