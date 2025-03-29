import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { stopTrack } from "../../../redux/playerSlice"; // 👈 import your stopTrack action
import WaveformPlayer from "./WaveformPlayer";
import styles from "./TrackView.module.css";

const TrackView = ({ track }) => {
  const dispatch = useDispatch();
  const { currentTrackId } = useSelector((state) => state.globalPlayer);

  useEffect(() => {
    // When navigating to this track, ensure no other track is playing
    if (track?.id && currentTrackId && track.id !== currentTrackId) {
      dispatch(stopTrack());
    }
  }, [track?.id]);

  if (!track) {
    return <p>Loading track...</p>;
  }

  return (
    <div className={styles.trackPageContainer}>
      <div className={styles.trackContainer}>
        {/* Player Section */}
        <div
          className={styles.playerContainer}
          style={{ backgroundImage: `url(${track.backgroundImageUrl || "/header.png"})` }}
        >
          <WaveformPlayer 
            audioUrl={track.trackFileUrl} 
            trackId={track.id || "preview"}
            containerSize="large" 
            showPlayButton={!!track.trackFileUrl}
          />
        </div>

        {/* Track Image Section */}
        <div className={styles.trackImageContainer}>
          <img 
            src={track.trackImageUrl || "/logo3.png"} 
            alt="Track Cover" 
            className={styles.trackImage} 
          />
        </div>
      </div>
    </div>
  );
};

export default TrackView;
