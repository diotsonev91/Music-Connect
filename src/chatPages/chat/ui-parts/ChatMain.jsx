import React from 'react';
import styles from './ChatMain.module.css';
const ChatMain = ({ selectedChat }) => (
    <main className={styles.chatMain}>
      {selectedChat ? (
        <p>Chat content for {selectedChat.name}</p>
      ) : (
        <p>Please select a chat.</p>
      )}
    </main>
  );

export default ChatMain; 