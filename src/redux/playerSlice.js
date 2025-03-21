import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTrackId: null,
  audioUrl: null,
  isPlaying: false,
  progress: 0, // Progress between 0 - 1
};

const playerSlice = createSlice({
  name: "globalPlayer",
  initialState,
  reducers: {
    playTrack(state, action) {
      const { trackId, audioUrl } = action.payload;
      state.currentTrackId = trackId;
      state.audioUrl = audioUrl;
      state.isPlaying = true;
      state.progress = 0;
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
    },
    updateProgress(state, action) {
      state.progress = action.payload;
    },
  },
});

export const { playTrack, pauseTrack, resumeTrack, stopTrack, updateProgress } = playerSlice.actions;
export default playerSlice.reducer;
