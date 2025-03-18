import React, { useState } from "react";
import WaveformPlayer from "./WaveformPlayer";
import styles from "./TrackView.module.css";

const TrackView = ({ track}) => {
  console.log('TRACK', track)
  if (!track) {
    return <p>Loading track...</p>; // ✅ Handle case where track is not available
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
            showPlayButton = {!!track.trackFile}
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
