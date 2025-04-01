import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom"; 
import useTrackMutation from "../../hooks/useTrackMutation"; 
import WaveformPlayer from "./shared/WaveformPlayer"; 
import styles from "./PlaylistPage.module.css"; 
import defaultImage from "/logo3.png"; 
import { FaHeart, FaShareAlt, FaEye, FaComment } from "react-icons/fa"; 
import { useAuth } from "../../contexts/AuthContext";
import ConfirmPopup from "../shared/App/ConfirmPopup";
import { playTrack , setActiveTrack } from "../../redux/playerSlice";
import { useDispatch } from "react-redux";

const PlaylistPage = ({  userId = "" }) => {
  const { playlistTitle } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchTracksByPlaylist, fetchTracksByUser, toggleTrackLike, fetchTrackLikes,   fetchTrackViews, 
  trackUserViewOnTrack, fetchTrackComments, fetchTopRatedTracks, isLoading, error, deleteTrackWithFiles } = useTrackMutation();
  const [tracks, setTracks] = useState([]);
  const { user} = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const userIdFromQuery = searchParams.get("userId"); 
  const isCurrentUsersSongs = playlistTitle === "myUploads" || location.pathname === "/profile";

  const dispatch = useDispatch(); //new line


  const userName = searchParams.get("userName");

  const effectiveUserId = userId || userIdFromQuery;
  const [displayTitle, setDisplayTitle] = useState(() => {
    return effectiveUserId && userName
      ? `Songs by ${decodeURIComponent(userName)}`
      : playlistTitle;
  });

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [trackToDelete, setTrackToDelete] = useState(null);
  const [playbackQueue, setPlaybackQueue] = useState([]);

  useEffect(() => {
    const loadTracks = async () => {
      try {  
        let data = [];
        
        if (effectiveUserId) {
          data = await fetchTracksByUser(effectiveUserId);
        } else {
          
          if(playlistTitle == "topRated"){
            data = await fetchTopRatedTracks();
            setDisplayTitle("Top Rated Tracks");
          }else {
            data = await fetchTracksByPlaylist(playlistTitle, user);
          
            switch (playlistTitle) {
              case "newTracks":
                setDisplayTitle("New Tracks");
                break;
              case "myUploads":
                setDisplayTitle("My Uploads");
                break;
              case "myPlaylist":
                setDisplayTitle("Songs I Like");
                break;
              default:
                setDisplayTitle(playlistTitle);
            }
          
          }
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
          const minimalQueue = tracksWithStats.map((t) => ({
            id: t.id,
            trackFileUrl: t.trackFileUrl,
          }));
          setPlaybackQueue(minimalQueue);
          setTracks(tracksWithStats);
          console.log(minimalQueue)
          console.log(tracksWithStats)
        }
           
      } catch (err) {
        console.error("Error loading tracks:", err);
      }
    };

    if (playlistTitle || effectiveUserId ) {
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

  
  const openDeletePopup = (track) => {
    setTrackToDelete(track);
    setShowDeletePopup(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!trackToDelete) return;
  
    const result = await deleteTrackWithFiles(
      trackToDelete.id,
      trackToDelete.trackFileUrl,
      trackToDelete.trackImageUrl,
      trackToDelete.backgroundImageUrl
    );
  
    if (result.success) {
      setTracks(prev => prev.filter(t => t.id !== trackToDelete.id));
    } else {
      alert("Failed to delete track: " + result.error);
    }
  
    setShowDeletePopup(false);
    setTrackToDelete(null);
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

  //new function bellow 
  const handlePlayFromPlaylist = (trackId, index) => {
    if (!tracks.length) return;
    
    const trackToPlay = tracks.find(t => t.id === trackId) || tracks[index];
    setActiveTrack(trackId);
    dispatch(playTrack({
      trackId: trackToPlay.id,
      audioUrl: trackToPlay.trackFileUrl,
      playlistQueue: playbackQueue, // The full playlist
      currentTrackIndex: index, // Current position
      playlistSource: playlistTitle
    }));
  };

  return (
    <div className={styles.playlistContainer}>
      <h2 className={styles.playlistTitle}>
    {displayTitle}
</h2>


      {isLoading ? (
        <p>Loading tracks...</p>
      ) : error ? (
        <p className={styles.error}>Error: {error.message}</p>
      ) : tracks.length === 0 ? (
        <p className={styles.noTracks}>No tracks found in this playlist.</p>
      ) : (
        tracks.map((track, index) => (
          <div key={track.id} className={styles.trackItem}>
            {/* Clickable Track Title */}
            <h3 className={styles.trackTitle} onClick={() => handleTrackClick(track.id)}>
                {track.trackName}
                </h3>

            <div className={styles.trackContent}>
              {/* Waveform Player */}
              {track.trackFileUrl && ( <WaveformPlayer trackId={track.id} audioUrl={track.trackFileUrl} showComments={false}
              onClick={() => handlePlayFromPlaylist(track.id, index)}
              > 
                {isCurrentUsersSongs && (
                  <div className={styles.trackEdits}>

                  <button
                    className={styles.editButton}
                    onClick={() => navigate(`/track/${track.id}/edit`)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className={styles.editButton}
                    onClick={() => openDeletePopup(track)}
                  >
                    🗑️ Delete
                  </button>
                  </div>
                )}

                 </WaveformPlayer>
              )}

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
      <ConfirmPopup
  isOpen={showDeletePopup}
  onClose={() => setShowDeletePopup(false)}
  onConfirm={handleConfirmDelete}
  message={`Are you sure you want to delete "${trackToDelete?.trackName}"?`}
/>
    </div>
    
  );
};

export default PlaylistPage;