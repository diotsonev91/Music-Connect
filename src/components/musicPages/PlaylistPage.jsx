import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom"; // For navigation
import useTrackMutation from "../../hooks/useTrackMutation"; // Import hook
import WaveformPlayer from "./shared/WaveformPlayer"; // Import player
import styles from "./PlaylistPage.module.css"; // Import styles
import defaultImage from "/logo3.png"; // Default image
import { FaHeart, FaShareAlt, FaEye, FaComment } from "react-icons/fa"; // Import icons

const PlaylistPage = () => {
  const { playlistTitle } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchTracksByPlaylist, isLoading, error } = useTrackMutation();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    console.log("USE EFFECT INSIDE PLAYLIST TRIGGERED")
    console.log(playlistTitle)
    const loadTracks = async () => {
      const data = await fetchTracksByPlaylist(playlistTitle);
      if (data) {
        console.log("TRACK DATA IN PLAYLIST:",data)
        setTracks(data);
      }
    };

    if (playlistTitle) {
      loadTracks();
    }
  }, [location.key]);

  // Handle like button
  const handleLike = (trackId) => {
    setTracks((prevTracks) =>
      prevTracks.map((track) =>
        track.id === trackId ? { ...track, likes: (track.likes || 0) + 1 } : track
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

      {isLoading ? (
        <p>Loading tracks...</p>
      ) : error ? (
        <p className={styles.error}>Error: {error.message}</p>
      ) : tracks.length === 0 ? (
        <p className={styles.noTracks}>No tracks found in this playlist.</p>
      ) : (
        tracks.map((track) => (
          <div key={track.id} className={styles.trackItem}>
            {/* Clickable Track Title */}
            <h3 className={styles.trackTitle} onClick={() => navigate(`/track/${track.id}`)}>
              {track.trackName}
            </h3>

            <div className={styles.trackContent}>
              {/* Waveform Player */}
              <WaveformPlayer trackId={track.id} audioUrl={track.trackFileUrl} showComments={false}/>

              {/* Track Image */}
              <div className={styles.trackImageBox}>
                <img src={track.trackImageUrl || defaultImage} alt={track.trackName} className={styles.trackImage} />
              </div>
            </div>

            {/* Track Actions - Like, Share, Views, Comments */}
            <div className={styles.trackActions}>
              <button className={styles.actionButton} onClick={() => handleLike(track.id)}>
                <FaHeart /> {track.likes || 0}
              </button>
              <button className={styles.actionButton} onClick={() => handleShare(track.id)}>
                <FaShareAlt />
              </button>
              <span className={styles.trackStats}>
                <FaEye /> {track.views || 0}
              </span>
              <span className={styles.trackStats}>
                <FaComment /> {track.comments || 0}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PlaylistPage;
