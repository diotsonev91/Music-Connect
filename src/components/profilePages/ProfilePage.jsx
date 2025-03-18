import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import FileUploadButton from "../shared/App/FileUploadButton";
import PlaylistPage from "../musicPages/PlaylistPage"; // Your playlist component
import UserBlogs from "../blogPages/UserBlogs";   // New blog component for user's blogs

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { uid } = useParams(); // If viewing another user profile
  const isOwnProfile = !uid || uid === user?.uid;

  const [motto, setMotto] = useState("");
  const [avatar, setAvatar] = useState(user?.photoURL || "/default_avatar.png");
  const [showSongs, setShowSongs] = useState(false);
  const [showBlogs, setShowBlogs] = useState(false);

  const handleAvatarChange = (file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2>{isOwnProfile ? "👤 My Profile" : "🎵 Artist Profile"}</h2>

      <img src={avatar} alt="Profile" className={styles.avatar} />
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>UID:</strong> {user?.uid}</p>

      {isOwnProfile && (
        <>
          <FileUploadButton 
            accept="image/*" 
            buttonText="Upload Avatar" 
            onFileSelect={handleAvatarChange} 
          />

          <label htmlFor="motto">Your Motto</label>
          <input 
            id="motto" 
            className={styles.mottoInput}
            placeholder="Share your musical motto..." 
            value={motto}
            onChange={(e) => setMotto(e.target.value)}
          />

          <button onClick={logout} className={styles.logoutButton}>Logout</button>
        </>
      )}

      {/* 🔥 Dropdowns */}
      <div className={styles.dropdownContainer}>
        <button onClick={() => setShowSongs(!showSongs)} className={styles.dropdownBtn}>
          🎶 {isOwnProfile ? "My Songs" : "Songs of Artist"}
        </button>
        {showSongs && (
          <div className={styles.dropdownContent}>
            <PlaylistPage userId={isOwnProfile ? user.uid : uid} />
          </div>
        )}

        <button onClick={() => setShowBlogs(!showBlogs)} className={styles.dropdownBtn}>
          📝 {isOwnProfile ? "My Blogs" : "Artist's Blogs"}
        </button>
        {showBlogs && (
          <div className={styles.dropdownContent}>
            <UserBlogs userId={isOwnProfile ? user.uid : uid} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
