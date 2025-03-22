import React from 'react';
import styles from './ChatMain.module.css';
import Message from './Message';
import { useAuth } from '../../../../contexts/AuthContext';
const ChatMain = ({ selectedChat, messages, chatUserAvatar }) => {
  const {user} = useAuth();
 
  return (
  <main className={styles.chatMain}>
    {selectedChat ? (
      messages && messages.length > 0 ? (
        messages.map((msg) => (
          <Message
            key={msg.id}
            text={msg.text}
            isSender={msg.senderId === user.uid} // Adjust based on logged-in user
            timeSent={new Date(msg.timestamp).toLocaleTimeString()}
            avatar={msg.senderId !== user.uid ? chatUserAvatar : ''} //  Only for received messages
            image={msg.image} 
          />
        ))
      ) : (
        <p className={styles.pStyle}>No messages yet. Start the conversation!</p>
      )
    ) : (
      <p className={styles.pStyle}>Please select a chat.</p>
    )}
  </main>
  )
};


export default ChatMain; 