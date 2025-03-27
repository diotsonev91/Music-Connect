import React from "react";
import { useState } from "react";
import styles from "./AppFooter.module.css";
import ConfirmPopup from "./ConfirmPopup";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AppFooter = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false); 

  const handleLink = (path) => {
    navigate(path);
  }; 
  
  const handleLogout = () => {
    setShowConfirm(true); // ⬅️ open confirm popup
  };
  
  const confirmLogout = async () => {
    await logout();
    navigate("/");
    setShowConfirm(false);
  };
  
  const cancelLogout = () => {
    setShowConfirm(false);
  };
    
  const handleSocial = (platform) => {
    const urls = {
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      youtube: "https://youtube.com",
    };
    window.open(urls[platform], "_blank");
  };

  return (
    <div className={styles.footerWrapper}>
      <div className={styles.footer}>
        <div className={styles.bubbles}>
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className={styles.bubble}
              style={{
                "--size": `${2 + Math.random() * 4}rem`,
                "--distance": `${6 + Math.random() * 4}rem`,
                "--position": `${-5 + Math.random() * 110}%`,
                "--time": `${2 + Math.random() * 2}s`,
                "--delay": `${-1 * (2 + Math.random() * 2)}s`,
              }}
            />
          ))}
        </div>

        <div className={styles.content}>
          <div>
            <div>
              <b>Discover</b>
              <a onClick={() => handleLink("/artists")}>Artists</a>
              <a onClick={() => handleLink("/music")}>Genres</a>
              <a onClick={() => handleLink("/music")}>Playlists</a>
            </div>

            <div>
              <b>Account</b>
              {user ? (
                <>
                  <a onClick={() => handleLink("/profile")}>Profile</a>
                  <a onClick={() => handleLogout()}>Logout</a>
                </>
              ) : (
                <a onClick={() => handleLink("/login")}>Login</a>
              )}
            </div>

            <div>
              <b>Resources</b>
              <a href="#">Help Center</a>
              <a href="#">Community</a>
            </div>

            <div>
              <b>Connect</b>
              <a onClick={() => handleSocial("twitter")}>Twitter</a>
              <a onClick={() => handleSocial("instagram")}>Instagram</a>
              <a onClick={() => handleSocial("facebook")}>Facebook</a>
              <a onClick={() => handleSocial("youtube")}>YouTube</a>
            </div>
          </div>

          <div className={styles.logo}>
          <p >© {new Date().getFullYear()} Music Connect</p>
          </div>
        </div>
      </div>

      <svg className={styles.svg}>
        <defs>
          <filter id="blob">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="blob"
            />
          </filter>
        </defs>
      </svg>
      <ConfirmPopup
  isOpen={showConfirm}
  onClose={cancelLogout}
  onConfirm={confirmLogout}
  message="Are you sure you want to logout?"
/>
    </div>
  );
};

export default AppFooter;
