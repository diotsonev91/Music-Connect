import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ChatList from './chat-list/ChatList';
import ChatWindow from './chat/ChatWindow';
import styles from './ChatPage.module.css';
import { fetchChats, createOrGetPrivateChat } from '../../redux/chatSlice'; 

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const chatList = useSelector(state => state.chat.chatList);
  const { chatId } = useParams();

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  // ✅ Auto-select chat if URL has /chat/:chatId
  useEffect(() => {
    if (chatId && chatList.length > 0) {
      const foundChat = chatList.find(chat => chat.id === chatId);
      if (foundChat) {
        setSelectedChat(foundChat);
      }
    }
  }, [chatId, chatList]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleAddUserByEmail = () => {
    if (!email.trim()) return;

    // ✅ Dispatch saga action to handle chat creation logic
    dispatch(createOrGetPrivateChat({ email }));
    setEmail('');
  };

  return (
    <div className={styles.chatPage}>
      <ChatList chats={chatList} onChatSelect={handleChatSelect}>
        <div className={styles.addUserSection}>
          <input
            type="text"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleAddUserByEmail}>Add New User</button>
        </div>
      </ChatList>

      <ChatWindow selectedChat={selectedChat} />
    </div>
  );
};

export default ChatPage;
