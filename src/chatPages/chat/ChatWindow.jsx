import React from 'react';
import styles from './ChatWindow.module.css';
import ChatHeader from "./ui-parts/ChatHeader"
import ChatMain from "./ui-parts/ChatMain"
import ChatFooter from "./ui-parts/ChatFooter"
const ChatWindow = ({ selectedChat }) => {
    console.log(selectedChat);
  
    return (
      <div className={styles.chatWindow}>
            <ChatHeader user={selectedChat?.name} />
            <ChatMain selectedChat={selectedChat} />
            <ChatFooter/>   
      </div>
    );
  };

export default ChatWindow;