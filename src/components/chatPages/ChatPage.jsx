import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ChatList from './chat-list/ChatList';
import ChatWindow from './chat/ChatWindow';
import styles from './ChatPage.module.css';
import { fetchChats, createOrGetPrivateChat, deleteChat } from '../../redux/chatSlice'; 
import AddButton from '../shared/App/AddButton';
import { useAuth } from "../../contexts/AuthContext";
import { useUserProfile } from "../../hooks/useUserProfile";
import ConfirmPopup from "../shared/App/ConfirmPopup"; // 




const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [email, setEmail] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);          
  const [chatToDelete, setChatToDelete] = useState(null); 
  
  
  const dispatch = useDispatch();
  const chatList = useSelector(state => state.chat.chatList);
  const { chatId } = useParams();
  const { user } = useAuth(); 
  const { searchUserByEmail } = useUserProfile();

  useEffect(() => {
    dispatch(fetchChats({ userId: user.uid }));
  }, [dispatch, , user]);

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



  const handleDeleteChat = (chatId) => {
    setChatToDelete(chatId);     // ✅ store which chat to delete
    setPopupOpen(true);          // ✅ show popup
  };

  const confirmDelete = () => {
    dispatch(deleteChat({ chatId: chatToDelete, userId: user.uid }));
    setPopupOpen(false);
    setChatToDelete(null);
  };

  const cancelDelete = () => {
    setPopupOpen(false);
    setChatToDelete(null);
  };

  const handleAddUserByEmail = async () => {
    if (!email.trim()) return;
  
    const targetUser = await searchUserByEmail(email);
    if (!targetUser) {
      alert("User not found.");
      return;
    }
    const cleanTargetUser = { 
      ...targetUser, 
      createdAt: targetUser.createdAt?.toMillis?.() || null 
    };
  
    dispatch(createOrGetPrivateChat({
      userId: user.uid,      
      targetUser:cleanTargetUser            
    }));
  
    setEmail('');
  };

  return (
    <div className={styles.chatPage}>
      <ChatList chats={chatList} 
      onChatSelect={handleChatSelect}
      onDeleteChat={handleDeleteChat}
      >
        <div className={styles.addUserSection}>
          <input
            type="text"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
         
          <AddButton onClick={handleAddUserByEmail} text="+ Add New User" />
        
        </div>
      </ChatList>

      <ChatWindow selectedChat={selectedChat} />

      <ConfirmPopup 
        isOpen={popupOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this chat?"
      />
    </div>
  );
};

export default ChatPage;
