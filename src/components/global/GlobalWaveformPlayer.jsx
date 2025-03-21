import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { pauseTrack, resumeTrack, updateProgress } from "../../redux/playerSlice";
import WavesurferPlayer from "@wavesurfer/react";
import styles from "./globalPlayer.module.css";

const GlobalWaveformPlayer = () => {
  const dispatch = useDispatch();
  const { audioUrl, isPlaying } = useSelector((state) => state.globalPlayer);
  const waveRef = useRef(null);
  const shouldAutoPlayRef = useRef(false);
  const [volume, setVolume] = useState(0.5); // ✅ Default volume at 50%

  useEffect(() => {
    if (isPlaying) {
      shouldAutoPlayRef.current = true;
    }
  }, [audioUrl]);

  useEffect(() => {
    if (waveRef.current) {
      waveRef.current.setVolume(volume); // ✅ Update volume when slider changes
      if (isPlaying) {
        waveRef.current.play();
      } else {
        waveRef.current.pause();
      }
    }
  }, [isPlaying, volume]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (waveRef.current) {
        const ws = waveRef.current;
        const progress = ws.getDuration() ? ws.getCurrentTime() / ws.getDuration() : 0;
        dispatch(updateProgress(progress));
      }
    }, 500);
    return () => clearInterval(interval);
  }, [dispatch]);

  if (!audioUrl) return null;

  return (
    <div className={styles.globalPlayer}>
      <WavesurferPlayer
        url={audioUrl}
        backend="WebAudio"
        height={80}
        waveColor="#fff"
        progressColor="#f97316"
        cursorColor="#fff"
        barWidth={3}
        normalize={true}
        ref={waveRef}
        onReady={(ws) => {
          console.log("Wavesurfer is ready!");
          waveRef.current = ws;
          waveRef.current.setVolume(volume); 
          if (shouldAutoPlayRef.current) {
            ws.play();
          }
        }}
        onError={(error) => {
          console.error("Wavesurfer error:", error);
        }}
      />

        <div className={styles.trackControl}>
      <button
        className={styles.playPauseBtn}
        onClick={() => dispatch(isPlaying ? pauseTrack() : resumeTrack())}
      >
        {isPlaying ? "⏸ Pause" : "▶ Play"}
      </button>

      {/* ✅ Volume Slider */}
      <div className={styles.volumeContainer}>
        <label>Volume:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
        />
      </div>
      </div>
    </div>
  );
};

export default GlobalWaveformPlayer;
