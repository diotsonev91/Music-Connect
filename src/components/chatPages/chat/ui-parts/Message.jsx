import React from "react";
import styles from "./Message.module.css";
import { useState } from "react";
const Message = ({ text, isSender, timeSent, avatar, image }) => {
    const [isImageOpen, setIsImageOpen] = useState(false);

  return (
    <>
     {/* If there's an image, display it above the text message */}
   {image && (
    <div className={`${styles.imageContainer} ${isSender ? styles.imageContainerSender : styles.imageContainerReceiver}`}>
      <img 
        src={image} 
        alt="Sent content" 
        className={styles.messageImage}
        onClick={() => setIsImageOpen(true)} // Click to enlarge
      />
    </div>
  )}
    <div className={`${styles.messageWrapper} ${isSender ? styles.sender : styles.receiver}`}>
      
      {/* Avatar Image */}
      {!isSender && (
        <img 
            src={avatar ? avatar : "/default_avatar.png"}
            alt="User Avatar"
            className={styles.avatar}
        />
      )}

      {/* Message Content */}
      <div className={styles.messageBubble}>
        <p>{text}</p>
        <span className={`${styles.timestamp} ${isSender ? styles.senderTimestamp : ""}`}>{timeSent}</span>
      </div>

        {/* Fullscreen Image Modal */}
        {isImageOpen && (
        <div className={styles.overlay} onClick={() => setIsImageOpen(false)}>
          <img src={image} alt="Enlarged content" className={styles.fullscreenImage} />
        </div>
      )}
    </div>
    </>
  );
};

export default Message;
