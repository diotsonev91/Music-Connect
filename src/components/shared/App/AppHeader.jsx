import React from "react";
import styles from "./AppHeader.module.css";
import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import { useTheme } from "../../../contexts/ThemeContext"; // Import ThemeContext
import GlobalWaveformPlayer from "../../global/GlobalWaveformPlayer";
import NotificationIcon from "../../notifications/NotificationIcon";
const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme(); // Get theme state


  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <h1 className={styles.logo} onClick={() => navigate("/")}>
          Music Connect
        </h1>

        {/* Navigation Links */}
        <ul className={styles.navLinks}>
          <li onClick={() => navigate("/music")}>
            <span
              
              className={`${styles.navItem} ${styles.musicBefore}`}
            >
              music
            </span>
          </li>
          {user && (
            <li>
              <span
                onClick={() => navigate("/chat")}
                className={`${styles.navItem} ${styles.chatBefore}`}
              >
                chat
              </span>
            </li>
          )}
          <li>
            <span
              onClick={() => navigate("/blogs")}
              className={`${styles.navItem} ${styles.blogBefore}`}
            >
              blogs
            </span>
          </li>
          {user ? (
            <>
              <li>
                <span
                  onClick={() => navigate("/profile")}
                  className={`${styles.navItem} ${styles.profileBefore}`}
                >
                  prof
                </span>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className={`${styles.navItem} ${styles.logoutBefore}`}
                >
                  logout
                </button>
              </li>
              <li>
                <NotificationIcon/>
              </li>
            </>
          ) : (
            <>
              <li>
                <span
                  onClick={() => navigate("/login")}
                  className={`${styles.navItem} ${styles.loginBefore}`}
                >
                  login
                </span>
              </li>
              <li>
                <span
                  onClick={() => navigate("/register")}
                  className={`${styles.navItem} ${styles.registerBefore}`}
                >
                  register
                </span>
              </li>
            </>
          )}
           {/* Theme Toggle Button */}
           <li>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={styles.themeToggle}
              title="Toggle Dark Mode"
            >
              {darkMode ? "🌙" : "☀️"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
    <GlobalWaveformPlayer /> 
    </>

  );
};

export default AppHeader;
