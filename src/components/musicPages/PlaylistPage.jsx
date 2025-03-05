import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import WaveformPlayer from "./shared/WaveformPlayer"; // Import your existing player
import styles from "./PlaylistPage.module.css"; // Import styles
import defaultImage from "/logo3.png"; // Default image
import { FaHeart, FaShareAlt, FaEye, FaComment } from "react-icons/fa"; // Import icons

const PlaylistPage = ({ playlistTitle = "Test Playlist UI" }) => {
  const navigate = useNavigate();
  console.log("Playlist Title:", playlistTitle);

  // Test data
  const [tracks, setTracks] = useState([
    { 
      trackId: "1", 
      title: "Track One", 
      audioUrl: "/chillSample.mp3",
      imageUrl: "/test_hiphop.webp",
      likes: 10,
      views: 120,
      comments: 5
    },
    { 
      trackId: "2", 
      title: "Track Two", 
      audioUrl: "/chillSample.mp3",
      imageUrl: "/test_hiphop.webp",
      likes: 8,
      views: 95,
      comments: 2
    },
    { 
      trackId: "3", 
      title: "Track Three", 
      audioUrl: "/chillSample.mp3",
      imageUrl: "/test_hiphop.webp",
      likes: 15,
      views: 180,
      comments: 7
    },
  ]);

  // Handle like button
  const handleLike = (trackId) => {
    setTracks((prevTracks) =>
      prevTracks.map((track) =>
        track.trackId === trackId ? { ...track, likes: track.likes + 1 } : track
      )
    );
  };

  // Handle share button
  const handleShare = (trackId) => {
    const shareUrl = `${window.location.origin}/track/${trackId}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <div className={styles.playlistContainer}>
      <h2 className={styles.playlistTitle}>{playlistTitle}</h2>

      {tracks.map((track) => (
        <div key={track.trackId} className={styles.trackItem}>
          {/* Clickable Track Title */}
          <h3 
            className={styles.trackTitle} 
            onClick={() => navigate(`/track/${track.trackId}`)}
          >
            {track.title}
          </h3>

          <div className={styles.trackContent}>
            {/* Waveform Player */}
            <WaveformPlayer 
              trackId={track.trackId} 
              audioUrl={track.audioUrl} 
              showComments={false} 
            />

            {/* Track Image */}
            <div className={styles.trackImageBox}>
              <img 
                src={track.imageUrl || defaultImage} 
                alt={track.title} 
                className={styles.trackImage} 
              />
            </div>
          </div>

          {/* Track Actions - Like, Share, Views, Comments */}
          <div className={styles.trackActions}>
            <button className={styles.actionButton} onClick={() => handleLike(track.trackId)}>
              <FaHeart /> {track.likes}
            </button>
            <button className={styles.actionButton} onClick={() => handleShare(track.trackId)}>
              <FaShareAlt />
            </button>
            <span className={styles.trackStats}>
              <FaEye /> {track.views}
            </span>
            <span className={styles.trackStats}>
              <FaComment /> {track.comments}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaylistPage;
