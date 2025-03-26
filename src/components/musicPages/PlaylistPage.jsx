import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom"; // For navigation
import useTrackMutation from "../../hooks/useTrackMutation"; // Import hook
import WaveformPlayer from "./shared/WaveformPlayer"; // Import player
import styles from "./PlaylistPage.module.css"; // Import styles
import defaultImage from "/logo3.png"; // Default image
import { FaHeart, FaShareAlt, FaEye, FaComment } from "react-icons/fa"; // Import icons
import { useAuth } from "../../contexts/AuthContext";

const PlaylistPage = ({  userId = "" }) => {
  const { playlistTitle } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchTracksByPlaylist, fetchTracksByUser, toggleTrackLike, fetchTrackLikes,   fetchTrackViews, 
  trackUserViewOnTrack, fetchTrackComments, isLoading, error } = useTrackMutation();
  const [tracks, setTracks] = useState([]);
  const { user} = useAuth();
  

  useEffect(() => {
    const loadTracks = async () => {
      try { 
        let data = [];
        if (userId) {
          data = await fetchTracksByUser(userId);
        } else {
          data = await fetchTracksByPlaylist(playlistTitle, user);
          console.log("fetvched by playlist", data)
        }
        if (data){
          const tracksWithStats = await Promise.all(
            data.map(async (track) => {
              const likesCount = await fetchTrackLikes(track.id);
              const comments = await fetchTrackComments(track.id);
              const viewsCount = await fetchTrackViews(track.id);
              return {
                ...track,
                likes: likesCount,
                commentsCount: comments.length,
                views: viewsCount
              };
            })
          );
          setTracks(tracksWithStats);
        }
           
      } catch (err) {
        console.error("Error loading tracks:", err);
      }
    };

    if (playlistTitle || userId) {
      loadTracks();
    }
  }, [location.key]);

  // Handle like button
  const handleLikeClick = async (trackId) => {
    const result = await toggleTrackLike(trackId, user);
  if (result.success) {
    const updatedLikes = await fetchTrackLikes(trackId);
    setTracks(prev =>
      prev.map(t => t.id === trackId ? { ...t, likes: updatedLikes } : t)
    );
  } else {
    console.error(result.error);
  }
  };

  const handleTrackClick = async (trackId) => {
    if (user?.uid) {
      await trackUserViewOnTrack(trackId, user.uid);
    }
    navigate(`/track/${trackId}`);
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
            <h3 className={styles.trackTitle} onClick={() => handleTrackClick(track.id)}>
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
              <button className={styles.actionButton} onClick={() => handleLikeClick(track.id)}>
                <FaHeart /> {track.likes || 0}
              </button>
              <button className={styles.actionButton} onClick={() => handleShare(track.id)}>
                <FaShareAlt />
              </button>
              <span className={styles.trackStats}>
                <FaEye /> {track.views || 0}
              </span>
              <span className={styles.trackStats}>
                <FaComment /> {track.commentsCount || 0}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PlaylistPage;
