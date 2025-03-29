import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { pauseTrack, resumeTrack, updateProgress, setPlayerReady  } from "../../redux/playerSlice";
import WavesurferPlayer from "@wavesurfer/react";
import styles from "./globalPlayer.module.css";

const GlobalWaveformPlayer = () => {
  const dispatch = useDispatch();
  const { audioUrl, isPlaying } = useSelector((state) => state.globalPlayer);

  const [volume, setVolume] = useState(0.5);
  const [waveKey, setWaveKey] = useState(0);
  const [waveInstance, setWaveInstance] = useState(null);
  const [previousUrl, setPreviousUrl] = useState(null);

  // 🔁 Handle switching tracks (destroy previous instance cleanly)
  useEffect(() => {
    console.log("AUDIO URL ",audioUrl)
    if (audioUrl && previousUrl && audioUrl !== previousUrl && waveInstance) {
      console.log("⛔ Cleaning up previous WaveSurfer instance");
      try {
        waveInstance.pause();
        waveInstance.stop?.();
        waveInstance.destroy();
      } catch (err) {
        console.warn("⚠️ Error during cleanup:", err);
      }
      setWaveInstance(null);
    }

    if (audioUrl && audioUrl !== previousUrl) {
      setWaveKey((k) => k + 1);
      setPreviousUrl(audioUrl);
    }

    return () => {
      if (waveInstance) {
        console.log("🧹 Cleaning up on unmount");
        try {
          waveInstance.stop?.();
          waveInstance.destroy();
        } catch (err) {
          console.warn("⚠️ Cleanup error:", err);
        }
        setWaveInstance(null);
      }
    };
  }, [audioUrl]);

  // ⏯️ Control play/pause and volume
  useEffect(() => {
    if (waveInstance) {
      waveInstance.setVolume(volume);
      isPlaying ? waveInstance.play() : waveInstance.pause();
    }
  }, [isPlaying, volume, waveInstance]);

  // ⏱️ Update global playback progress
  useEffect(() => {
    const interval = setInterval(() => {
      if (waveInstance) {
        const progress = waveInstance.getDuration()
          ? waveInstance.getCurrentTime() / waveInstance.getDuration()
          : 0;
        dispatch(updateProgress(progress));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [dispatch, waveInstance]);

  if (!audioUrl) return null;

  return (
    <div className={styles.globalPlayer}>
      <WavesurferPlayer
        key={waveKey}
        url={audioUrl}
        backend="WebAudio"
        height={80}
        waveColor="#fff"
        progressColor="#f97316"
        cursorColor="#fff"
        barWidth={3}
        normalize
        onReady={(ws) => {
          console.log("🎧 Global WaveSurfer ready");
          setWaveInstance(ws);
          ws.setVolume(volume);
        
          // ✅ Dispatch when waveform is ready
          if (isPlaying) ws.play();
          dispatch(setPlayerReady());
        
         
        }}
        onError={(error) => {
          if (
            error?.name === "AbortError" ||
            error?.message?.includes("The operation was aborted")
          ) {
            console.log("⚠️ Ignored harmless abort error");
            return;
          }
          console.error("❌ Wavesurfer error:", error);
        }}
        onDestroy={() => {
          console.log("🧹 WaveSurfer instance destroyed");
          setWaveInstance(null);
        }}
      />

      <div className={styles.trackControl}>
        <button
          className={styles.playPauseBtn}
          onClick={() => dispatch(isPlaying ? pauseTrack() : resumeTrack())}
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>

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
