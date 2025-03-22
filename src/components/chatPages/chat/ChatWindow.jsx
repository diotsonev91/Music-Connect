import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ChatWindow.module.css';
import ChatHeader from "./ui-parts/ChatHeader";
import ChatMain from "./ui-parts/ChatMain";
import ChatFooter from "./ui-parts/ChatFooter";
import { fetchMessages } from '../../../redux/chatSlice';

const ChatWindow = ({ selectedChat }) => {
  const dispatch = useDispatch();
  const messages = useSelector(state => 
    selectedChat ? state.chat.messagesByChat[selectedChat.id] || [] : []
  );
  
  useEffect(() => {
    if (selectedChat) {
      dispatch(fetchMessages(selectedChat.id)); 
    }
  }, [selectedChat, dispatch]);

  return (
    <div className={styles.chatWindow}>
      <ChatHeader selectedChat={selectedChat} />
      <ChatMain 
        selectedChat={selectedChat} 
        messages={messages} 
        chatUserAvatar={selectedChat?.avatar} // ✅ Pass avatar down
      />
      <ChatFooter selectedChat={selectedChat} />
    </div>
  );
};

export default ChatWindow;
