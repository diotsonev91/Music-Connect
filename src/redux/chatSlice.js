import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatList: [],
    messagesByChat: {},  // ✅ Store messages per chat ID
    error: null,
  },
  reducers: {
    fetchChats: () => {},
    setChats: (state, action) => {
      state.chatList = action.payload;
    },

    fetchMessages: () => {},
    sendMessage: (state, action) => {},

    // ✅ NEW reducer - sets messages per chat
    setMessagesForChat: (state, action) => {
      const { chatId, messages } = action.payload;
      state.messagesByChat[chatId] = messages;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  fetchChats, 
  setChats, 
  fetchMessages, 
  sendMessage, 
  setMessagesForChat, 
  setError 
} = chatSlice.actions;

export default chatSlice.reducer;
