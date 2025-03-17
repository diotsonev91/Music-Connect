import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import WaveformPlayer from "./shared/WaveformPlayer";
import CommentsSection from "./CommentsSection";
import styles from "./TrackPage.module.css";


const TrackPage = ({ track, showComments = true }) => {
  const { id } = useParams(); // Get track ID from URL

  if (!track) {
    return <p>Loading track...</p>; // ✅ Handle case where track is not available
  }

  const [selectedTimestamp, setSelectedTimestamp] = useState(null);

  return (
    // extract this part
    <div className={styles.trackPageContainer}>
      <div className={styles.trackContainer}>
        {/* Player Section */}
        <div
          className={styles.playerContainer}
          style={{ backgroundImage: `url(${track.backgroundImageUrl || "/header.png"})` }}
        >
          <WaveformPlayer 
            audioUrl={track.trackFileUrl} 
            trackId={id}
            onTimestampClick={(time) => setSelectedTimestamp(time)} 
            showComments={showComments}
            containerSize="large" 
          />
        </div>

        {/* Track Image Section */}
        <div className={styles.trackImageContainer}>
          <img src={track.trackImageUrl || "/test_hiphop.webp"} alt="Track Cover" className={styles.trackImage} />
        </div>
      </div>
      {/* exctract to this line */}
      {/* Author Section */}
      {showComments && 
        <>      
          <div className={styles.authorInfo}>
            <img src={track.author?.avatar || "/default_avatar.png"} alt="Author Avatar" className={styles.authorAvatar} />
            <span>{track.author?.displayName || "Unknown Artist"}</span>
            <a href={`/profile/${track.author?.uid}`} className={styles.profileButton}>
              View Profile
            </a>
          </div>

          {/* Comments Section with Track ID */}
          <CommentsSection 
            trackId={id}
            selectedTimestamp={selectedTimestamp}
            resetTimestamp={() => setSelectedTimestamp(null)} 
          />
        </>
      }
    </div>
  );
};

export default TrackPage;
