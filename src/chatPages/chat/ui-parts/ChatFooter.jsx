import React from 'react';
import styles from './ChatFooter.module.css';
const ChatFooter = () => (
    <footer className={styles.chatFooter}>
      <input type="text" placeholder="Type a message..." />
      <button>Send</button>
    </footer>
  );

 export default ChatFooter; 