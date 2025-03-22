import React, { useEffect, useState } from 'react';
import styles from './ChatList.module.css';
import { useAuth } from '../../../contexts/AuthContext';
import { useUserProfile } from '../../../hooks/useUserProfile';

const ChatList = ({ chats, onChatSelect, children }) => {
  const { user } = useAuth();
  const { fetchProfileField } = useUserProfile();
  const [otherUserProfiles, setOtherUserProfiles] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChats, setFilteredChats] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const profiles = {};
      for (const chat of chats) {
        const otherUserId = chat.participants?.find(id => id !== user.uid);
        if (otherUserId && !profiles[otherUserId]) {
          const profile = await fetchProfileField(otherUserId);
          profiles[otherUserId] = profile;
        }
      }
      setOtherUserProfiles(profiles);
      setFilteredChats(chats); // Initialize filtered chats
    };

    if (chats.length > 0) {
      fetchProfiles();
    }
  }, [chats]);

  // 🔎 Filter logic triggered when clicking the search icon
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredChats(chats); // Reset if search empty
      return;
    }

    const filtered = chats.filter(chat => {
      const otherUserId = chat.participants?.find(id => id !== user.uid);
      const profile = otherUserProfiles[otherUserId];
      const displayName = profile?.displayName?.toLowerCase() || '';
      const email = profile?.email?.toLowerCase() || '';

      return (
        otherUserId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        displayName.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase())
      );
    });

    setFilteredChats(filtered);
  };

  return (
    <aside className={styles.chatList}>
      <h2 className={styles.title}>Chats</h2>
      {children}

      <div className={styles.searchBar}>
        <img
          src="./search.png"
          alt="Search"
          onClick={handleSearch}
          style={{ cursor: "pointer" }}
        />
        <input
          aria-label="Search for inspiration"
          placeholder="Search by name, email, or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ul className={styles.list}>
        {filteredChats.map((chat) => {
          const otherUserId = chat.participants?.find(id => id !== user.uid);
          const profile = otherUserProfiles[otherUserId];
          const displayName = profile?.displayName || profile?.email || "Unknown User";
          const avatar = profile?.photoURL || "./default_avatar.png";

          return (
            <li
              key={chat.id}
              className={styles.listItem}
              onClick={() => onChatSelect(chat)}
            >
              <img className={styles.avatar} src={avatar} alt="User Avatar" />
              <div className={styles.chatInfo}>
                <span className={styles.chatName}>{displayName}</span>
                <span className={styles.lastMessage}>{chat.lastMessage}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default ChatList;
