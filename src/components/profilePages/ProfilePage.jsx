import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import FileUploadButton from "../shared/App/FileUploadButton";
import PlaylistPage from "../musicPages/PlaylistPage";
import UserBlogs from "../blogPages/UserBlogs";
import { useUserProfile } from "../../hooks/useUserProfile";
import AddButton from "../shared/App/AddButton";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { uid } = useParams();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState({});
  const [motto, setMotto] = useState("");
  const [avatar, setAvatar] = useState(user?.photoURL || "/default_avatar.png");
  const [showSongs, setShowSongs] = useState(false);
  const [showBlogs, setShowBlogs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayName, setdisplayName] = useState("");
  const [reloadProfile, setReloadProfile] = useState(false);

  const isOwnProfile = !uid || uid === user?.uid;
  const {
    updateMotto,
    updateAvatar,
    updateProfileField,
    fetchAvatar,
    fetchMotto,
    fetchProfileField,
    fetchUserById
  } = useUserProfile();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = isOwnProfile ? user.uid : uid;
        const avatarUrl = await fetchAvatar(userId);
        const mottoText = await fetchMotto(userId);
        const fullProfile = await fetchProfileField(userId);
        const fetchedUser = isOwnProfile ? user : await fetchUserById(uid);

        setAvatar(avatarUrl || "/default_avatar.png");
        setMotto(mottoText || "");
        setdisplayName(fullProfile.displayName || "");
        setCurrentUser({ ...fetchedUser, ...fullProfile });
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    loadProfile();
  }, [reloadProfile, uid, user?.uid, isOwnProfile]);

  const handleSaveMotto = async () => {
    if (!user?.uid || !motto) return;
    setLoading(true);
    const res = await updateMotto(user.uid, motto);
    setLoading(false);
    if (res.success) {
      setReloadProfile(prev => !prev);
    } else {
      alert("Failed to save motto");
    }
  };

  const handleSaveDisplayName = async () => {
    if (!user?.uid || !displayName.trim()) return;
    setLoading(true);
    const res = await updateProfileField(user.uid, { displayName });
    setLoading(false);
    if (res.success) {
      setReloadProfile(prev => !prev);
    } else {
      alert("Failed to save display name");
    }
  };

  const handleAvatarChange = async (file) => {
    if (file && user?.uid) {
      const previewUrl = URL.createObjectURL(file);
      setAvatar(previewUrl);

      setLoading(true);
      const result = await updateAvatar(user.uid, file, user.photoURL);
      if (result.success && result.avatarUrl) {
        setAvatar(result.avatarUrl);
      } else {
        alert("Failed to update avatar");
        setAvatar(user.photoURL || "/default_avatar.png");
      }
      setLoading(false);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2>{isOwnProfile ? "👤 My Profile" : "🎵 Artist Profile"}</h2>
      <button onClick={logout} className={styles.logoutButton}>Logout</button>

      <div className={styles.infoContainer}>
  
        <div>
          <img src={avatar} alt="Profile" className={styles.avatar} />
      <p className={styles.profileParagraph}><strong>Email:</strong> {currentUser?.email}</p>
      <p className={styles.profileParagraph}><strong>UID:</strong> {currentUser?.uid || uid}</p>
      <p className={styles.profileParagraph}><strong>Display Name:</strong> {currentUser?.displayName || "N/A"}</p>
      <p className={styles.profileParagraph}><strong>Motto:</strong> {currentUser?.motto || "N/A"}</p>
      </div>
      {isOwnProfile && (
              <div className={styles.fileButtonWrapper}> 
                <FileUploadButton
                accept="image/*"
                buttonText={avatar && avatar !== "/default_avatar.png" ? "Change Avatar" : "Upload Avatar"}
                onFileSelect={handleAvatarChange}
              />
              </div>
      )}
     
      </div>
      {isOwnProfile && (
        <div className={styles.displayInfo}>
          
            <label htmlFor="displayName">Set Display Name</label>
            <input
              id="displayName"
              type="text"
              className={styles.displayNameInput}
              placeholder="Enter your display name"
              value={displayName}
              onChange={(e) => setdisplayName(e.target.value)}
            />
            <AddButton
              onClick={handleSaveDisplayName}
              className={styles.saveMottoButton}
              disabled={loading}
              text={loading ? "Saving..." : !displayName ? "Save Display Name" : "Edit Display Name"}
            />
             
           
         

  

        
            <label htmlFor="motto">Your Motto</label>
            <textarea
              id="motto"
              className={styles.mottoInput}
              placeholder="Share your musical motto..."
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              rows={7}
            />
            <AddButton
              onClick={handleSaveMotto}
              className={styles.saveMottoButton}
              disabled={loading}
              text={loading ? "Saving..." : motto ? "Edit Motto" : "Save Motto"}
            />
              
           
          

           <label></label> {/* Empty label to align with the row */}
           <div></div>     {/* Empty input cell to align columns */}
          <div className={styles.editButtonWrapper}>
            <button
              className={styles.editCredsBtn}
              onClick={() => navigate("/profile/edit-user")}
              >
              ✏️ Edit User Credentials
            </button>
          </div>
              </div>
      )}

      <div className={styles.dropdownContainer}>
        <button onClick={() => setShowSongs(!showSongs)} className={styles.dropdownBtn}>
          🎶 {isOwnProfile ? "My Songs" : "Songs of Artist"}
        </button>
        {showSongs && (
          <>
         {isOwnProfile &&  <AddButton to="/track/upload" text="+ Add New Track" /> }
          <div className={styles.dropdownContent}>
            <PlaylistPage userId={isOwnProfile ? user.uid : uid} />
          </div>
          </>
        )}

        <button onClick={() => setShowBlogs(!showBlogs)} className={styles.dropdownBtn}>
          📝 {isOwnProfile ? "My Blogs" : "Artist's Blogs"}
        </button>
        {showBlogs && (
          <>
                {isOwnProfile &&  <AddButton to="/blog_post" text="+ Add New Blog" /> }
          <div className={styles.dropdownContent}>
            <UserBlogs userId={isOwnProfile ? user.uid : uid} />
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
