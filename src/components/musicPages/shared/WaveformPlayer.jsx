import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { playTrack, pauseTrack } from "../../../redux/playerSlice";
import { useComments } from "../../../contexts/TrackCommentContext";
import WavesurferPlayer from "@wavesurfer/react";
import styles from "./WaveformPlayer.module.css";

const WaveformPlayer = ({
  trackId,
  audioUrl,
  showComments = false,
  containerSize = "small",
  showPlayButton = true,
  onTimestampClick = () => {},
}) => {
  const dispatch = useDispatch();
  const { comments = {} } = showComments ? useComments() : { comments: {} };

  const { currentTrackId, isPlaying, progress } = useSelector(
    (state) => state.globalPlayer
  );

  const isCurrentTrack = currentTrackId === trackId;
  const isCurrentPlaying = isCurrentTrack && isPlaying;

  const handlePlayPause = () => {
    if (isCurrentPlaying) {
      dispatch(pauseTrack());
    } else {
      dispatch(playTrack({ trackId, audioUrl }));
    }
  };

  const handleAddComment = () => {
    const time = progress; // Use global progress, or pass a timestamp
    onTimestampClick(time);
  };


  
  return (
    <div className={`${styles.waveformContainer} ${styles[containerSize]}`}>
      {/* 🔥 Render Wavesurfer JUST FOR VISUAL */}
      <WavesurferPlayer
    url={audioUrl}
    backend="WebElement"
    height={120}
    barWidth={6}
    waveColor="#ccc"
    interact={false}
    cursorWidth={0}
    normalize={true}
    muted={true}
    volume={0}
    playing={false}
  />

  {/* 🔥 Overlay */}
  {isCurrentTrack && (
  <div 
    className={styles.progressOverlay} 
    style={{ width: `${progress * 100}%` }}
    onClick={handlePlayPause}
  >
    {isCurrentPlaying ? (
       <i className={`${styles.arrow} ${styles.pause}`}></i> // Or use a proper icon if you have one
    ) : (
      <i className={`${styles.arrow} ${styles.right}`}></i>
    )}
  </div>
)}
  

      {/* 🔥 Comments Markers */}
      {showComments &&
        comments[trackId] &&
        comments[trackId].filter((c) => c.time >= 0).length > 0 && (
          <div className={styles.commentMarkers}>
            {comments[trackId]
              .filter((comment) => comment.time >= 0)
              .map((comment, index) => {
                const leftPosition = `${comment.time * 100}%`; // Adjust if needed based on duration
                return (
                  <div
                    key={index}
                    className={styles.commentMarker}
                    style={{ left: leftPosition }}
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

      {/* 🔥 Play/Pause */}
      {showPlayButton && (
        <button onClick={handlePlayPause} className={styles.playButton}>
          {isCurrentPlaying ? "Pause" : "Play"}
        </button>
      )}

      {/* 🔥 Add Comment */}
      {showComments && (
        <button onClick={handleAddComment} className={styles.commentButton}>
          Add Comment at {Math.floor(progress * 100)}%
        </button>
      )}
    </div>
  );
};

export default WaveformPlayer;
