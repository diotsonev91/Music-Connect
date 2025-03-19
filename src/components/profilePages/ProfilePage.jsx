import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import FileUploadButton from "../shared/App/FileUploadButton";
import PlaylistPage from "../musicPages/PlaylistPage";
import UserBlogs from "../blogPages/UserBlogs";
import { useUserProfile } from "../../hooks/useUserProfile"; 
import { updateEmail, updatePassword } from "firebase/auth";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { uid } = useParams();
  const [currentUser, setCurrentUser] = useState({});
  const isOwnProfile = !uid || uid === user?.uid;

  const [motto, setMotto] = useState("");
  const [avatar, setAvatar] = useState(user?.photoURL || "/default_avatar.png");
  const [showSongs, setShowSongs] = useState(false);
  const [showBlogs, setShowBlogs] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [displayName, setdisplayName] = useState("");

  const { updateMotto, updateAvatar, updateProfileField ,fetchAvatar, fetchMotto, fetchProfileField, fetchUserById } = useUserProfile();


  useEffect(() => {
    const loadProfile = async () => {
      try {
        let avatarUrl = "";
        let mottoText = "";
        let fullProfile = {};
        let fetchedUser = {};
  
        if (isOwnProfile) {
          avatarUrl = await fetchAvatar(user.uid);
          mottoText = await fetchMotto(user.uid);
          fullProfile = await fetchProfileField(user.uid);
          fetchedUser = user; // Auth user is available
        } else {
          avatarUrl = await fetchAvatar(uid);
          mottoText = await fetchMotto(uid);
          fullProfile = await fetchProfileField(uid);
          fetchedUser = await fetchUserById(uid); 
        }
        
        console.log("Full profile", fullProfile);
        setAvatar(avatarUrl || "/default_avatar.png");
        setMotto(mottoText || "");
        setdisplayName(fullProfile.displayName || "");
        setCurrentUser(fullProfile);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };
  
    loadProfile();
  }, []);
  

  // ✅ Save Motto Handler
  const handleSaveMotto = async () => {
    if (!user?.uid || !motto) return;
    setLoading(true);
    const res = await updateMotto(user.uid, motto); 
    setLoading(false);
    res.success ? alert("Motto saved!") : alert("Failed to save motto");
  };


  const handleSaveDisplayName = async () => {
    if (!user?.uid || !displayName.trim()) return;
    setLoading(true);
    const res = await updateProfileField(user.uid, { displayName });
    setLoading(false);
    res.success ? alert("displayName saved!") : alert("Failed to save displayName");
  };
  // ✅ Upload and Save Avatar
  const handleAvatarChange = async (file) => {
    if (file && user?.uid) {
      // ✅ Show instant preview of the uploaded image
      const previewUrl = URL.createObjectURL(file);
      setAvatar(previewUrl);  // Immediate preview in <img />
  
      setLoading(true);
      const result = await updateAvatar(user.uid, file, user.photoURL);
      if (result.success && result.avatarUrl) {
        setAvatar(result.avatarUrl); // ✅ Replace preview with actual storage URL
      } else {
        alert("Failed to update avatar");
        // Optional: Reset preview to old avatar if upload fails
        setAvatar(user.photoURL || "/default_avatar.png");
      }
      setLoading(false);
    }
  };

  // ✅ Update Email or Password in Firebase Auth
  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (newEmail) {
        await updateEmail(user, newEmail);
        alert("Email updated successfully!");
      }
      if (newPassword) {
        await updatePassword(user, newPassword);
        alert("Password updated successfully!");
      }
      setNewEmail("");
      setNewPassword("");
    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2>{isOwnProfile ? "👤 My Profile" : "🎵 Artist Profile"}</h2>
     
      <img src={avatar} alt="Profile" className={styles.avatar} />
      <p><strong>Email:</strong> {currentUser?.email}</p>
      <p><strong>UID:</strong> {currentUser?.uid || uid}</p>
     
      <>
      <p><strong>Display Name:</strong> {currentUser?.displayName ||   "N/A"} </p>
      <p><strong>Motto:</strong> {currentUser?.motto ||  "N/A"} </p>
      </>
      
      {isOwnProfile && (
        <>
        <div className={styles.section_displayName}>
  <label htmlFor="displayName">Set display Name</label>
  <input
    id="displayName"
    type="text"
    className={styles.displayNameInput}
    placeholder="Enter your display Name"
    value={displayName}
    onChange={(e) => setdisplayName(e.target.value)}
  />

  <button
    onClick={handleSaveDisplayName}
    className={styles.saveMottoButton}
    disabled={loading}
  >
    {loading ? "Saving..." : !displayName ? "Save displayName" : "Edit displayName"}
  </button>
</div>

          <FileUploadButton 
            accept="image/*" 
            buttonText={avatar && avatar !== "/default_avatar.png" ? "Change Avatar" : "Upload Avatar"}
            onFileSelect={handleAvatarChange} 
          />
          <div className={styles.section_motto}>
          <label htmlFor="motto">Your Motto</label>
          <textarea 
            id="motto" 
            className={styles.mottoInput}
            placeholder="Share your musical motto..." 
            value={motto}
            onChange={(e) => setMotto(e.target.value)}
            rows={3}
          />

          <button 
            onClick={handleSaveMotto} 
            className={styles.saveMottoButton}
            disabled={loading}
          >
          {loading ? "Saving..." : motto ? "Edit Motto" : "Save Motto"}
          </button>
          </div>
          <button onClick={logout} className={styles.logoutButton}>Logout</button>
        </>
      )}

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

        {isOwnProfile && (
         
            <div className={styles.edit_section}>
            <h3>Edit Email or Password</h3>

            <div>
              <label htmlFor="newEmail">Change Email</label>
              <input
                type="email"
                id="newEmail"
                placeholder="Enter new email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="newPassword">Change Password</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        )}
      
    </div>
  );
};

export default ProfilePage;
