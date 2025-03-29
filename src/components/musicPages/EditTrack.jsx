import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useTrackMutation from "../../hooks/useTrackMutation"; // ✅ Use our custom hook
import { useParams } from "react-router-dom";
import TrackForm from "./TrackForm";
import TrackView from "./shared/TrackView";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { stopTrack } from "../../redux/playerSlice";
const EditTrack = () => {
  const { id } = useParams(); // ✅ Get track ID from URL
  const { user } = useAuth(); // ✅ Get user from AuthContext
  const { saveOrUpdateTrack, fetchTrackById, isLoading, error, message } = useTrackMutation(); // ✅ Use mutation hook
  const navigate = useNavigate();
  // ✅ Store the full track object
  const [trackData, setTrackData] = useState(null);
  const dispatch = useDispatch(); 

  // ✅ Fetch track by ID first
  useEffect(() => {
    const loadTrack = async () => {
      const track = await fetchTrackById(id); // ✅ Fetch the track by ID
      console.log("FETCHED TRACK INSIDE EDIT TRACK: ",track);
      if (track) {
        setTrackData(track);
      }
    };
    loadTrack();
  }, [id]);

  useEffect(() => {
    if (trackData) {
      console.log("📦 trackData has been set:", trackData);
    }
  }, [trackData]);


  
  // ✅ Handle form submission
  const handleSubmit = async (formData) => {
    if (!user) return;

    const result = await saveOrUpdateTrack(formData, user, id);
    console.log("RESULT OF UPDATE TRACK ",  result)
    if (result.success) {
        navigate(`/track/${result.id}`); 
      
    }
  };

  return trackData ? (
    <div>
      <h1>Edit Track</h1>

      {/* ✅ Render TrackPage with Full Track Data */}
      <TrackView track={trackData} />

      {/* ✅ Pass Full Track Data to Form */}
      <TrackForm 
        trackData={trackData} 
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
