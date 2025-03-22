import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatList from './chat-list/ChatList';
import ChatWindow from './chat/ChatWindow';
import styles from './ChatPage.module.css';
import { fetchChats } from '../../redux/chatSlice';
import { useChatActions } from '../../hooks/useChatActions';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const chatList = useSelector(state => state.chat.chatList);
  const { createOrGetPrivateChat } = useChatActions(); // ✅ Use the new hook

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };


  const handleAddUserByEmail = async () => {
    const result = await createOrGetPrivateChat(email);
    if (result.success) {
      // Optional: If new chat, refresh the chat list
      dispatch(fetchChats());
  
      // ✅ Auto-select the chat (DM)
      setSelectedChat(result.chat);
  
      setEmail('');
      alert(result.message);
    } else {
      alert(result.message);
    }
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
