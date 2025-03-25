import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatList: [],
    messagesByChat: {},
    error: null,
  },
  reducers: {
    fetchChats: () => {},
    setChats: (state, action) => {
      state.chatList = action.payload;
    },
    fetchMessages: () => {},
    sendMessage: () => {}, 
    setMessagesForChat: (state, action) => {
      const { chatId, messages } = action.payload;
      state.messagesByChat[chatId] = messages;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setMessagesAsRead: () => {}, 
    createOrGetPrivateChat: () => {},
  },
});


export const { 
  fetchChats, 
  setChats, 
  fetchMessages, 
  sendMessage, 
  setMessagesForChat, 
  setError ,
  setMessagesAsRead,
  createOrGetPrivateChat,
} = chatSlice.actions;

export default chatSlice.reducer;
