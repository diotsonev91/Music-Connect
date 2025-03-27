import React from "react";
import useArtists from "../../hooks/useArtists";
import styles from "./Artists.module.css";
import { useNavigate } from "react-router-dom";

export default function Artists() {
  const { artists, loading, error } = useArtists();
  const navigate = useNavigate();

  const handleViewProfile = (uid) => {
    navigate(`/profile/${uid}`);
  };

  const handleViewSongs = (artist) => {
    
    const name = artist.displayName || artist.email;
    navigate(`/playlist?userName=${encodeURIComponent(name)}&userId=${artist.uid}`);
  };

  return (
    <div className={styles.artistsWrapper}>
      <h2 className={styles.title}> Featured Artists</h2>

      {loading && <p>Loading artists...</p>}
      {error && <p>Error loading artists: {error.message}</p>}
      {!loading && artists.length === 0 && <p>No artists found.</p>}

      <div className={styles.artistGrid}>
        {artists.map((artist) => (
          <div className={styles.artistCardWrapper}>
          <div key={artist.uid} className={styles.artistCard}>
            <img
              src="/default_avatar.png"
              alt={artist.displayName || artist.email}
              className={styles.avatar}
            />
            <p className={styles.name}>{artist.displayName || artist.email}</p>
            <p className={styles.motto}>{artist.motto || "No artist motto"}</p>
          </div>

          <div className={styles.buttons}>
          <button onClick={() => handleViewProfile(artist.uid)}>
            View Profile
          </button>
          <button onClick={() => handleViewSongs(artist)}>
            View Songs
          </button>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}
