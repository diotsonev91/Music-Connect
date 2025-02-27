import React from "react";
import styles from "./ChatHeader.module.css";

const ChatHeader = ({ user }) => (
  <header className={styles.chatHeader}>
    <div className={styles.userInfo}>
       {user &&       <img className={styles.avatar} src={user?.avatar || "./default_avatar.png"} alt="User Avatar" />} 
      <div className={styles.texts}>
        <span>{user || "Select user"}</span>
      </div>
    </div>
    <button className={styles.profileButton}>view profile</button>
  </header>
);

export default ChatHeader;
