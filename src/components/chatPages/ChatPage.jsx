import React, { useState } from 'react';
import ChatList from './chat-list/ChatList';
import ChatWindow from './chat/ChatWindow';
import styles from './ChatPage.module.css';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  // Test
  const chats = [
    { id: 1, name: 'Kiro ', lastMessage: 'Hey, how are you?' },
    { id: 2, name: 'Asen', lastMessage: 'See you later!' },
  ];

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className={styles.chatPage}>
      <ChatList chats={chats} onChatSelect={handleChatSelect} />
      
      <ChatWindow selectedChat={selectedChat} />
    </div>
  );
};

export default ChatPage;