import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
  },
  reducers: {
    addNotification: (state, action) => {
      const existsIndex = state.list.findIndex(n => n.id === action.payload.id);
      if (existsIndex !== -1) {
        // ✅ Replace the old notification for that chat
        state.list[existsIndex] = action.payload;
      } else {
        state.list.unshift(action.payload);
      }
    },
    markAsRead: (state, action) => {
      const notif = state.list.find(n => n.id === action.payload);
      if (notif) {
        notif.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.list.forEach(n => n.read = true);
    },
    clearNotifications: (state) => {
      state.list = [];
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
