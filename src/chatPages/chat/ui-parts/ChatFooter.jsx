import React, { useState } from "react";
import styles from "./ChatFooter.module.css";
import EmojiPicker from "emoji-picker-react";

const ChatFooter = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
    
  };

  return (
    <footer className={styles.chatFooter}>
      <div className={styles.icons}>
        <img src="/img.png" alt="" />
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      
      <div className={styles.emojiWrapper}>
      {/* Emoji Picker Button */}
      <div onClick={() => setOpen(!open)} className={`${styles.emoji} ${open ? styles.emojiActive : ""}`}>
        <img src="/emoji.svg"  style={{ cursor: "pointer" }}/>
      </div>
      {open &&
        <div className={styles.emojiPicker}>
           <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
            }
        </div>
      <button className={styles.buttonSend}>Send</button>
    </footer>
  );
};

export default ChatFooter;
