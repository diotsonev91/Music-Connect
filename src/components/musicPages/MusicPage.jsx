import React from "react";
import {
  FaMusic,
  FaHeadphones,
  FaGuitar,
  FaDrum,
  FaMicrophone,
} from "react-icons/fa";
import styles from "./MusicPage.module.css";
import hipHopImage from "/hip_hop.png";
import popImage from "/pop.png";
import rockImage from "/rock.png";
import ethnicImage from "/ethnic.png";
import classicalImage from "/classical.png";
import acousticImage from "/acoustic.png";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const genres = [
  { name: "Hip Hop", icon: <FaMicrophone />, image: hipHopImage },
  { name: "Pop", icon: <FaHeadphones />, image: popImage },
  { name: "Rock", icon: <FaGuitar />, image: rockImage },
  { name: "Etnic", icon: <FaDrum />, image: ethnicImage },
  { name: "Classical", icon: <FaMusic />, image: classicalImage },
  { name: "Acoustic", icon: <FaGuitar />, image: acousticImage },
];

export default function MusicPage() {
  const navigate = useNavigate(); 
  const { user, logout } = useAuth();

  const handleGenreClick = (genreName) => {
    navigate(`/playlist/${genreName.toLowerCase()}`); 
  };

  return (
    <div className={styles.mainContainer}>
      {user ? (
        <div className={styles.customPlaylists}>
          <div className={styles.favorite}>
            <p>My Playlist</p>
          </div>
          <div className={styles.newOnes}>
            <p>New tracks</p>
          </div>
          <div className={styles.myUploads}>
            <p>My Uploads</p>
          </div>
        </div>
      ) : (
        <>
          <h2 className={styles.title}>Добре дошли в Music Connect</h2>
          <p className={styles.subtitle}>
            Откривайте нови песни, общувайте с приятели и се наслаждавайте на
            музиката!
          </p>
        </>
      )}
      <div className={styles.background}>
        <div className={styles.container}>
          <div className={styles.cardsList}>
            {genres.map((genre, index) => (
              <div key={index} className={styles.card}
              onClick={() => handleGenreClick(genre.name)}
              >
                <div className={styles.cardImage}>
                  <img src={genre.image} alt={genre.name} />
                </div>
                <div className={styles.cardTitle}>
                  <span className={styles.cardIcon}>{genre.icon}</span>
                  {genre.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

