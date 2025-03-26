import React from "react";
import styles from "./AppFooter.module.css";

const AppFooter = () => {
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
              <a href="#">Artists</a>
              <a href="#">Genres</a>
              <a href="#">Playlists</a>
            </div>
            <div>
              <b>Account</b>
              <a href="#">Profile</a>
              <a href="#">Logout</a>
            </div>
            <div>
              <b>Resources</b>
              <a href="#">Help Center</a>
              <a href="#">Community</a>

            </div>
            <div>
              <b>Connect</b>
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
              <a href="#">Facebook</a>
              <a href="#">YouTube</a>
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
      </div>
  );
};

export default AppFooter;