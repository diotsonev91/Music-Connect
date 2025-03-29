import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  currentTrackId: null,
  audioUrl: null,
  isPlaying: false,
  progress: 0,
  isReady: false, // ✅ NEW: indicates waveform is loaded & ready
};

const playerSlice = createSlice({
  name: "globalPlayer",
  initialState,
  reducers: {
    playTrack(state, action) {
      const { trackId, audioUrl } = action.payload;
    
      const isSameTrack = state.currentTrackId === trackId;
    
      state.currentTrackId = trackId;
      state.audioUrl = audioUrl;
      state.isPlaying = true;
    
      // Only reset readiness if new track
      if (!isSameTrack) {
        state.isReady = false;
      }
    },
    pauseTrack(state) {
      state.isPlaying = false;
    },
    resumeTrack(state) {
      state.isPlaying = true;
    },
    stopTrack(state) {
      state.isPlaying = false;
      state.currentTrackId = null;
      state.audioUrl = null;
      state.progress = 0;
      state.isReady = false;
    },
    updateProgress(state, action) {
      state.progress = action.payload;
    },
    setPlayerReady(state, action) {
      state.isReady = true;
    },
  },
});

export const {
  playTrack,
  pauseTrack,
  resumeTrack,
  stopTrack,
  updateProgress,
  setPlayerReady,
} = playerSlice.actions;
export default playerSlice.reducer;
