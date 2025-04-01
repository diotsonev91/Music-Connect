import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  currentTrackId: null,
  audioUrl: null,
  isPlaying: false,
  progress: 0,
  isReady: false,
  activeTrackId: null,  
  playlistQueue: [],       
  currentTrackIndex: null,  
  pausedTrackId: null,
};

const playerSlice = createSlice({
  name: "globalPlayer",
  initialState,
  reducers: {
    playTrack(state, action) {
      const { trackId, audioUrl, playlistQueue, currentTrackIndex } = action.payload;
    
      const isSameTrack = state.currentTrackId === trackId;
    
      state.currentTrackId = trackId;
      state.audioUrl = audioUrl;
      state.isPlaying = true;
      state.activeTrackId = trackId;
      
      if (!isSameTrack) {
        state.isReady = false;
      }

      
      if (playlistQueue) {
        state.playlistQueue = playlistQueue;
        state.currentTrackIndex = currentTrackIndex;
      }
    },
    pauseTrack(state,action) {
      const { trackId } = action.payload;
      state.isPlaying = false;
      state.pausedTrackId = trackId;
      
    },
    resumeTrack(state, action) {
      const { trackId } = action.payload;
      console.log("PAUSED TRACK ID AND TRACK ID", state.pausedTrackId,trackId)
      if (state.pausedTrackId === trackId) {
        state.isPlaying = true;
      } else {
        playerSlice.caseReducers.stopTrack(state); 
      }
    },
    stopTrack(state) {
      state.isPlaying = false;
      state.currentTrackId = null;
      state.audioUrl = null;
      state.progress = 0;
      state.isReady = false;
      state.activeTrackId = null;
     
    },
    updateProgress(state, action) {
      state.progress = action.payload;
    },
    setPlayerReady(state, action) {
      state.isReady = true;
    },
    setActiveTrack(state, action) {
      state.activeTrackId = action.payload; 
    },
    playNextTrack(state) {
      if (!state.playlistQueue || state.currentTrackIndex === null) return;
      
      const nextIndex = state.currentTrackIndex + 1;
      const nextTrack = state.playlistQueue[nextIndex];
      
      if (nextTrack) {

        state.activeTrackId= nextTrack.id;
        state.currentTrackId = nextTrack.id;
        state.audioUrl = nextTrack.trackFileUrl;
        state.currentTrackIndex = nextIndex;
        state.isPlaying = true;
        state.isReady = false;
        state.pausedTrackId = null;
      } else {
        // End of playlist
        state.isPlaying = false;
      }
    },
    playPreviousTrack(state) {
      if (!state.playlistQueue || state.currentTrackIndex === null) return;

      const prevIndex = state.currentTrackIndex - 1;
      if (prevIndex >= 0) {
        const prevTrack = state.playlistQueue[prevIndex];
        state.activeTrackId= prevTrack.id;
        state.currentTrackId = prevTrack.id;
        state.audioUrl = prevTrack.trackFileUrl;
        state.currentTrackIndex = prevIndex;
        state.isPlaying = true;
        state.isReady = false;
        state.pausedTrackId = null;
      }
    }
  }
});

export const {
  playTrack,
  pauseTrack,
  resumeTrack,
  stopTrack,
  updateProgress,
  setPlayerReady,
  setActiveTrack,
  playPreviousTrack,
  playNextTrack,
} = playerSlice.actions;
export default playerSlice.reducer;