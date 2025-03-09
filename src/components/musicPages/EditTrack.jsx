import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import TrackForm from "./TrackForm";

const EditTrack = () => {
  const { trackId } = useParams(); // ✅ Get track ID from URL
  const [existingTrack, setExistingTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const trackRef = doc(db, "tracks", trackId);
        const trackSnap = await getDoc(trackRef);

        if (trackSnap.exists()) {
          setExistingTrack({ id: trackSnap.id, ...trackSnap.data() });
        } else {
          console.error("Track not found");
        }
      } catch (error) {
        console.error("Error fetching track:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
  }, [trackId]);

  if (loading) return <p>Loading track details...</p>;
  if (!existingTrack) return <p>Track not found.</p>;

  return (
    <div>
      <h1>Edit Track</h1>
      <TrackForm existingTrack={existingTrack} onSubmitSuccess={() => console.log("Track updated successfully!")} />
    </div>
  );
};

export default EditTrack;
 