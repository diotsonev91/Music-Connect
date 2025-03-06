import React from "react";
import { useNavigate } from "react-router-dom"; 
import styles from "./BlogMain.module.css";

// Importing background images
import eventsBg from "/events.png";
import newsBg from "/news.png";
import musiciansBg from "/musicians.png";
import searchBandBg from "/search_band.png";

const sections = [
  { title: "Upcoming Events", category: "events", description: "Stay updated with the latest music events happening around you.", image: eventsBg, buttonText: "View Events" },
  { title: "Latest News", category: "news", description: "Read about the hottest news in the music industry.", image: newsBg, buttonText: "Read News" },
  { title: "Meet the Musicians", category: "musicians", description: "Discover talented musicians and follow their journey.", image: musiciansBg, buttonText: "Explore Musicians" },
  { title: "Find a Band", category: "search_band", description: "Looking for a band to join or searching for new members?", image: searchBandBg, buttonText: "Search Bands" }
];

const BlogMain = () => {

  const navigate = useNavigate();

  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>Welcome to Music Blog</h1>

      {sections.map((section, index) => (
        <section key={index} className={styles.section} style={{ backgroundImage: `url(${section.image})` }}>
          <div className={styles.overlay}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <p className={styles.content}>{section.description}</p>
            <button className={styles.button} onClick={() => navigate(`/blogs/${section.category}`)}>
              {section.buttonText}</button>
          </div>
        </section>
      ))}
    </main>
  );
};

export default BlogMain;
