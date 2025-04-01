import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { playTrack, pauseTrack, stopTrack,setActiveTrack, setPlayerReady } from "../../../redux/playerSlice";
import { useComments } from "../../../contexts/TrackCommentContext";
import WavesurferPlayer from "@wavesurfer/react";
import styles from "./WaveformPlayer.module.css";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const WaveformPlayer = ({
  trackId,
  audioUrl,
  showComments = false,
  containerSize = "small",
  showPlayButton = true,
  children,
  onTimestampClick = () => {},
  onClick = () => {},

}) => {
  const dispatch = useDispatch();
  const { comments = {} } = showComments ? useComments() : { comments: {} };

  const {  activeTrackId, isPlaying, progress, isReady } = useSelector(
    (state) => state.globalPlayer
  );

  const isCurrentTrack = activeTrackId === trackId;
  const isCurrentPlaying = isCurrentTrack && isPlaying;
  const {user}= useAuth();
  

  const isLoading = false; //isCurrentTrack && !isReady && isPlaying;
  const waveRef = useRef(null);

  useEffect(() => {
    if (!isCurrentTrack && waveRef.current) {
      waveRef.current.pause?.();
      waveRef.current.stop?.();
      dispatch(playTrack({activeTrackId , audioUrl}))
    }
  }, [isCurrentTrack]);
 
  const playFromSource = () => {
    if(!showComments){
      onClick();
    }else{
      dispatch(playTrack({ trackId, audioUrl }));
    }
  }

  const handlePlayPause = () => {
    
    if (!audioUrl || isLoading) return;
        
    if (activeTrackId === trackId && isPlaying) {
      dispatch(pauseTrack({trackId}));
    }else if(activeTrackId === trackId){
    
        playFromSource();
   
    }else {
      // Prevent multiple clicks
      console.log("Active track id",activeTrackId)
      console.log("Current track id",trackId)
      
      dispatch(stopTrack());
     
      // Wait for global player to stabilize before dispatch
      setTimeout(() => {
        
        playFromSource();
        dispatch(setActiveTrack(trackId));
      }, 20); 
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
          dispatch(setPlayerReady())
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
          onClick={ handlePlayPause}
          className={styles.playButton}
          disabled={isLoading}
        >
           {isLoading ? "Loading..." : isCurrentPlaying ? "Pause" : "Play"}
        </button>
      )}

        
      {/* 📝 Add Comment */}
      {user &&  showComments && isCurrentTrack && (
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