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
    deleteChat: () => {},
    removeChat: (state, action) => {
      const chatId = action.payload;
      state.chatList = state.chatList.filter(chat => chat.id !== chatId);
    },
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
  deleteChat,
  removeChat,
} = chatSlice.actions;

export default chatSlice.reducer;
