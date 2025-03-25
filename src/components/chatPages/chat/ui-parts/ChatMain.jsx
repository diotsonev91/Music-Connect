import React, { useEffect, useRef } from 'react';
import styles from './ChatMain.module.css';
import Message from './Message';
import { useAuth } from '../../../../contexts/AuthContext';
import { useDispatch } from 'react-redux';
import { setMessagesAsRead } from '../../../../redux/chatSlice'; // Adjust your slice path

const ChatMain = ({ selectedChat, messages, chatUserAvatar }) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const messageRefs = useRef([]);

  useEffect(() => {
    if (!selectedChat || !messages || messages.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      const visibleMessageIds = entries
        .filter(entry => entry.isIntersecting)
        .map(entry => entry.target.dataset.msgid);

      if (visibleMessageIds.length > 0) {
        // ✅ Dispatch saga action to mark as read
        dispatch(setMessagesAsRead({
          chatId: selectedChat.id,
          messageIds: visibleMessageIds,
          userId: user.uid
        }));
      }
    }, { threshold: 1.0 });

    messageRefs.current.forEach((ref) => ref && observer.observe(ref));

    return () => {
      messageRefs.current.forEach((ref) => ref && observer.unobserve(ref));
    };
  }, [messages, selectedChat, dispatch, user.uid]);

  return (
    <main className={styles.chatMain}>
      {selectedChat ? (
        messages && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={msg.id}
              ref={el => messageRefs.current[index] = el}
              data-msgid={msg.id}
            >
              <Message
                text={msg.text}
                isSender={msg.senderId === user.uid}
                timeSent={new Date(msg.timestamp).toLocaleTimeString()}
                avatar={msg.senderId !== user.uid ? chatUserAvatar : ''}
                image={msg.image}
              />
            </div>
          ))
        ) : (
          <p className={styles.pStyle}>No messages yet. Start the conversation!</p>
        )
      ) : (
        <p className={styles.pStyle}>Please select a chat.</p>
      )}
    </main>
  );
};

export default ChatMain;
