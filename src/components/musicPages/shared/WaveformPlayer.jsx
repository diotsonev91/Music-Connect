import React, { useState, useEffect } from "react";
import WavesurferPlayer from "@wavesurfer/react";
import { useComments } from "../../../contexts/TrackCommentContext"; // Import comments context
import styles from "./WaveformPlayer.module.css";


const WaveformPlayer = ({ trackId, audioUrl, onTimestampClick = () => {}, showComments = false, containerSize = "small" , showPlayButton= true}) => {
  
  const { comments = {} } = showComments ? useComments() : { comments: {} }; 
  
  
  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

//   console.log("Track ID in WaveformPlayer:", trackId);
//  console.log("Comments for track:", trackId, comments);

  const onReady = (ws) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  };

  // Get comment timestamp when clicking "Add Comment"
  const handleAddComment = () => {
    if (wavesurfer) {
      const time = wavesurfer.getCurrentTime();
      setCurrentTime(time);
      onTimestampClick(time);
    }
  };

  // Keep updating the current timestamp when audio is playing
  useEffect(() => {
    if (!wavesurfer) return;

    const updateTime = () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    };

    const interval = setInterval(updateTime, 200); // Update every 200ms

    return () => clearInterval(interval); // Cleanup when unmounting
  }, [wavesurfer, isPlaying]);

  //console.log("Comments for track:", trackId, comments[trackId]); // Debugging log

  return (
    <div className={`${styles.waveformContainer} ${styles[containerSize]}`}>
      <WavesurferPlayer
        url={audioUrl}
        backend="MediaElement" 
        height={120}
        barWidth={3}
        waveColor="#ccc"
        progressColor="#f50"
        onReady={onReady}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
 
      
 {showComments && comments[trackId] && 
  comments[trackId].filter((comment) => comment.time >= 0).length > 0 && ( // ✅ Only count timestamped comments
  <div className={styles.commentMarkers}>
    {comments[trackId]
      .filter((comment) => comment.time >= 0) // ✅ Exclude comments with `time === -1`
      .map((comment, index) => {
        if (!wavesurfer || isNaN(wavesurfer.getDuration()) || wavesurfer.getDuration() === 0) return null; 

        const leftPosition = `${(comment.time / wavesurfer.getDuration()) * 100}%`;
        console.log(`Rendering marker at ${comment.time}s → left: ${leftPosition}`);

        return (
          <div
            key={index}
            className={styles.commentMarker}
            style={{ left: leftPosition }}
            title={comment.text}
          >
            <span className={styles.commentPreview}>
              {comment.text.length > 10 ? comment.text.substring(0, 10) + "..." : comment.text}
            </span>
          </div>
        );
      })}
  </div>
)}
      {showPlayButton && 
      <button onClick={handlePlayPause} className={styles.playButton}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      }

      {showComments && (
        <button onClick={handleAddComment} className={styles.commentButton}>
          Add Comment at {currentTime.toFixed(2)}s
        </button>
      )}
    </div>
  );
};

export default WaveformPlayer;
