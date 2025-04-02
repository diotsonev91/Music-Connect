import React, { useRef, useState } from "react";
import styles from "./ChatFooter.module.css";
import EmojiPicker from "emoji-picker-react";
import { useDispatch } from "react-redux";
import { sendMessage } from '../../../../redux/chatSlice';
import { useAuth } from "../../../../contexts/AuthContext";
import { uploadFile } from "../../../../services/firebaseStorage";
import Loader from "../../../shared/loaders/Loader"; 

const ChatFooter = ({ selectedChat }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); 
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useAuth();

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  const handleSend = () => {
    if (!selectedChat || !message.trim()) return;

    dispatch(
      sendMessage({
        chatId: selectedChat.id,
        text: message,
        senderId: user.uid,
      })
    );
    setMessage("");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedChat) return;

    setLoading(true); // ✅ Show loader

    try {
      const imageUrl = await uploadFile(file, "chat-images");
      dispatch(
        sendMessage({
          chatId: selectedChat.id,
          text: "",
          senderId: user.uid,
          image: imageUrl,
        })
      );
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setLoading(false); // ✅ Hide loader
    }
  };

  return (
    <>
      {loading && <Loader />} {/* ✅ Show loader if uploading */}

      <footer className={styles.chatFooter}>
        <div 
          className={styles.icons} 
          onClick={() => fileInputRef.current.click()}
        >
          <img src="/img.png" alt="Upload" style={{ cursor: "pointer" }} />
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: "none" }} 
            accept="image/*"
            onChange={handleImageUpload} 
          />
        </div>

        <input
          type="text"
          placeholder={selectedChat ? "Type a message..." : "Select a chat to start"}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!selectedChat}
        />

        <div className={styles.emojiWrapper}>
          <div 
            onClick={() => setOpen(!open)} 
            className={`${styles.emoji} ${open ? styles.emojiActive : ""}`}
          >
            <img src="/emoji.jpg" style={{ cursor: "pointer" }} />
          </div>
          {open && (
            <div className={styles.emojiPicker}>
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        <button 
          className={styles.buttonSend} 
          onClick={handleSend}
          disabled={!selectedChat || !message.trim()}
        >
          Send
        </button>
      </footer>
    </>
  );
};

export default ChatFooter;
