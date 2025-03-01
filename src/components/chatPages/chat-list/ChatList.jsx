import React from 'react';
import styles from './ChatList.module.css';

const ChatList = ({ chats, onChatSelect }) => {
  return (
    <aside className={styles.chatList}>
      <h2 className={styles.title}>Chats</h2>
      <div className={styles.searchBar}>
          <img src="./search.png" alt="" />
      <input aria-label="Search for inspiration"/>
      </div>
      <ul className={styles.list}>
        {chats.map((chat) => (
          <li
            key={chat.id}
            className={styles.listItem}
            onClick={() => onChatSelect(chat)}
          >
             <img className={styles.avatar} src={chat.name?.avatar || "./default_avatar.png"} alt="User Avatar" />
            <div className={styles.chatInfo}>
              <span className={styles.chatName}>{chat.name}</span>
              <span className={styles.lastMessage}>{chat.lastMessage}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ChatList;