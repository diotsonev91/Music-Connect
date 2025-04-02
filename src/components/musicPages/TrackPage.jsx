import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import WaveformPlayer from "./shared/WaveformPlayer";
import CommentsSection from "./CommentsSection";
import styles from "./TrackPage.module.css";
import useTrackMutation from "../../hooks/useTrackMutation"; 

const TrackPage = ({ showComments = true }) => {
  const { id } = useParams(); // ✅ Get track ID from URL
  const { fetchTrackById } = useTrackMutation(); 
  const [track, setTrack] = useState(null);
  const [selectedTimestamp, setSelectedTimestamp] = useState(null);

  // ✅ Fetch the track once the component mounts
  useEffect(() => {
    const fetchTrack = async () => {
      const fetchedTrack = await fetchTrackById(id);
      setTrack(fetchedTrack);
    };
    fetchTrack();
  }, [id, fetchTrackById]);

  if (!track) {
    return <p>Loading track...</p>; // ✅ Handle loading
  }

  return (
    <div className={styles.trackPageContainer}>
      <div className={styles.trackInfo}>
      <h2>{track.trackName}</h2>
      <div className={styles.genreWrapper}>
        <p>genre:</p>
      <p>{track.genre}</p>
      </div>
      </div>
      <div className={styles.trackContainer}>
        {/*  Player Section */}
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

        {/*  Track Image Section */}
        <div className={styles.trackImageContainer}>
          <img
            src={track.trackImageUrl || "/test_hiphop.webp"}
            alt="Track Cover"
            className={styles.trackImage}
          />
        </div>
      </div>

      {/*  Author + Comments Section */}
      {showComments && (
        <>
      
          <div className={styles.authorInfo}> 
        
            <img
              src={track.author?.avatar || "/default_avatar.png"}
              alt="Author Avatar"
              className={styles.authorAvatar}
            />
            <div className={styles.userNameNav}>
            <span>{track.author?.displayName || "Unknown Artist"}</span>
            <a href={`/profile/${track.author?.uid}`} className={styles.profileButton}>
              View Profile
            </a>
            </div>
          </div>

          <CommentsSection
            trackId={id}
            selectedTimestamp={selectedTimestamp}
            resetTimestamp={() => setSelectedTimestamp(null)}
          />
        </>
      )}
    </div>
  );
};

export default TrackPage;
