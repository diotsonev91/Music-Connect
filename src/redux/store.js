import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './playerSlice';
// Add other slices here if needed (notifications, user, etc.)

export const store = configureStore({
  reducer: {
    globalPlayer: playerReducer,
    // notifications: notificationsReducer, // future
  },
});
