import React, { useEffect, useState } from "react";
import styles from "./ChatHeader.module.css";
import { useAuth } from '../../../../contexts/AuthContext';
import { useUserProfile } from '../../../../hooks/useUserProfile';
import { useNavigate } from "react-router";

const ChatHeader = ({ selectedChat }) => {
  const { user } = useAuth();
  const { fetchProfileField } = useUserProfile();
  const [otherUserProfile, setOtherUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOtherUser = async () => {
      if (selectedChat) {
        const otherUserId = selectedChat.participants?.find(id => id !== user.uid);
        if (otherUserId) {
          const profile = await fetchProfileField(otherUserId);
          setOtherUserProfile(profile);
        }
      }
    };
    fetchOtherUser();
  }, [selectedChat, user.uid]);


  const handleViewProfile = () => {
    if (otherUserProfile) {
      navigate(`/profile/${otherUserProfile.id}`);
    }
  };

  const displayName = otherUserProfile?.displayName || otherUserProfile?.email || "Select user";
  const avatar = otherUserProfile?.photoURL || "./default_avatar.png";

  return (
    <header className={styles.chatHeader}>
      <div className={styles.userInfo}>
        {selectedChat && (
          <>
            <img className={styles.avatar} src={avatar} alt="User Avatar" />
            <div className={styles.texts}>
              <span>{displayName}</span>
            </div>
          </>
        )}
        {!selectedChat && (
          <div className={styles.texts}>
            <span> Select user</span>
          </div>
        )}
      </div>

      {selectedChat && (
        <button className={styles.profileButton} onClick={handleViewProfile}>View Profile</button>
      )}
    </header>
  );
};


export default ChatHeader;
