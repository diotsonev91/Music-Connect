import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import WaveformPlayer from "./shared/WaveformPlayer";
import CommentsSection from "./CommentsSection";
import styles from "./TrackPage.module.css";

const TrackPage = ({ showComments = true, trackImageURL = "", backgroundImageURL = "" }) => {

  const { id } = useParams(); // Get track ID from URL

  const demoTrack =  "/chillSample.mp3";
  const trackImage = trackImageURL || "/test_hiphop.webp";
  const backgroundImage = backgroundImageURL || "/header.png";
  const author = {
    name: "John Doe",
    avatar: "/default_avatar.png",
    profileUrl: "/profile/john-doe",
  };

  const [selectedTimestamp, setSelectedTimestamp] = useState(null);
  console.log("Track ID in TrackPage:", id); // 🛠 Debug
  return (
    <div className={styles.trackPageContainer}>
      <div className={styles.trackContainer}>
        {/* Player Section */}
        <div
          className={styles.playerContainer}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <WaveformPlayer 
          audioUrl={demoTrack}
          trackId={id}
          onTimestampClick={(time) => setSelectedTimestamp(time)} 
           showComments={showComments}
            containerSize="large" />
        </div>

        {/* Track Image Section */}
        <div className={styles.trackImageContainer}>
          <img src={trackImage} alt="Track Cover" className={styles.trackImage} />
        </div>
      </div>

      {/* Author Section */}
      {showComments && 
      <>      <div className={styles.authorInfo}>
        <img src={author.avatar} alt="Author Avatar" className={styles.authorAvatar} />
        <span>{author.name}</span>
        <a href={author.profileUrl} className={styles.profileButton}>
          View Profile
        </a>
      </div>

      {/* Comments Section with Track ID */}
       <CommentsSection trackId={id}
       selectedTimestamp={selectedTimestamp}
       resetTimestamp={() => setSelectedTimestamp(null)} 
       />
       </>

      }
    </div>
  );
};

export default TrackPage;
