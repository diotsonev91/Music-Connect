import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { playTrack, pauseTrack, stopTrack } from "../../../redux/playerSlice";
import { useComments } from "../../../contexts/TrackCommentContext";
import WavesurferPlayer from "@wavesurfer/react";
import styles from "./WaveformPlayer.module.css";
import { useLocation } from "react-router-dom";

const WaveformPlayer = ({
  trackId,
  audioUrl,
  showComments = false,
  containerSize = "small",
  showPlayButton = true,
  children,
  onTimestampClick = () => {},
}) => {
  const dispatch = useDispatch();
  const { comments = {} } = showComments ? useComments() : { comments: {} };

  const { currentTrackId, isPlaying, progress, isReady } = useSelector(
    (state) => state.globalPlayer
  );

  const [isLocalReady, setIsLocalReady] = useState(false);
  const [isPlayQueued, setIsPlayQueued] = useState(false);

  const isCurrentTrack = currentTrackId === trackId;
  const isCurrentPlaying = isCurrentTrack && isPlaying;
  const location = useLocation();



const isOnPlaylistPage = location.pathname.includes("/playlist");
const isLoading =
(isCurrentTrack && !isReady && !isCurrentPlaying) ||
(!isLocalReady && !isOnPlaylistPage);


  const waveRef = useRef(null);

  useEffect(() => {
    if (isPlayQueued && isReady && isLocalReady && !isCurrentPlaying) {
      dispatch(playTrack({ trackId, audioUrl }));
      setIsPlayQueued(false); // ✅ Reset queue flag
    }
  }, [isPlayQueued, isReady, isLocalReady, isCurrentPlaying, trackId, audioUrl, dispatch, location]);

  const handlePlayPause = () => {
    if (!audioUrl || isLoading || isPlayQueued) return;
  
    if (isCurrentPlaying) {
      dispatch(pauseTrack());
    } else {
      // Prevent multiple clicks
      setIsPlayQueued(true);
  
      // Wait for global player to stabilize before dispatch
      setTimeout(() => {
        dispatch(playTrack({ trackId, audioUrl }));
        setIsPlayQueued(false);
      }, 100); 
    }
  };

  const handleAddComment = () => {
    const time = progress;
    onTimestampClick(time);
  };

  return (
    <div className={`${styles.waveformContainer} ${styles[containerSize]}`}>

      {/* 🎧 Local preview waveform */}
      {audioUrl && (
      <WavesurferPlayer
      key={trackId} 
        url={audioUrl}
        backend="WebElement"
        height={120}
        barWidth={6}
        waveColor="#ccc"
        interact={false}
        cursorWidth={0}
        normalize
        muted
        volume={0}
        playing={false}
        ref={waveRef}
        onReady={(ws) => {
          waveRef.current = ws;
          setIsLocalReady(true);
        }}
        onError={(err) => {
          console.warn("WaveSurfer local error:", err);
          setIsLocalReady(true); // prevent infinite loading on fail
        }}
      />)}

      {/* 🔥 Overlay Progress */}
      {isCurrentTrack && (
        <div
          className={styles.progressOverlay}
          style={{ width: `${progress * 100}%` }}
          onClick={handlePlayPause}
        >
          {isLoading ? (
            <span className={styles.loadingText}>Loading...</span>
          ) : isCurrentPlaying ? (
            <i className={`${styles.arrow} ${styles.pause}`}></i>
          ) : (
            <i className={`${styles.arrow} ${styles.right}`}></i>
          )}
        </div>
      )}

      {/* 🗨️ Comments */}
      {showComments &&
        comments[trackId] &&
        comments[trackId].filter((c) => c.time >= 0).length > 0 && (
          <div className={styles.commentMarkers}>
            {comments[trackId].map((comment, index) => {
              const left = `${comment.time * 100}%`;
              return (
                <div
                  key={index}
                  className={styles.commentMarker}
                  style={{ left }}
                  title={comment.text}
                >
                  <span className={styles.commentPreview}>
                    {comment.text.length > 10
                      ? comment.text.substring(0, 10) + "..."
                      : comment.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}

      {/* ▶️ Play Button */}
      {showPlayButton && (
        <button
          onClick={handlePlayPause}
          className={styles.playButton}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : isCurrentPlaying ? "Pause" : "Play"}
        </button>
      )}

        
      {/* 📝 Add Comment */}
      {showComments && isCurrentTrack && (
        <button onClick={handleAddComment} className={styles.commentButton}>
          Add Comment at {Math.floor(progress * 100)}%
        </button>
      )}
     <div className={styles.buttonsWrapper}>        
         {children && <div className={styles.extraContent}>{children}</div>}
      </div>
    </div>
  );
};

export default WaveformPlayer;
