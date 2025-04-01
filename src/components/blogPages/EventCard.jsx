import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./EventCard.module.css";

const EventCard = ({ event }) => {
  const eventImg = event.imageUrl || "/event.png";
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  return (
    <motion.div 
      whileHover={{
        rotateX: -10,
        rotateY: 10,
        scale: 1.05,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className={styles.cardContainer}
    >
      <div className={styles.card}>
        <img src={eventImg} alt={event.title} className={styles.image} />
        <div className={styles.content}>
          <h3 className={styles.title}>{event.title}</h3>
          <p className={styles.price}><i className="fa-solid fa-money-bill"></i> {event.price} BGN</p>
          <p className={styles.date}><i className="fa-solid fa-calendar"></i> {event.date}</p>
          <div className={styles.location}>
            <i className="fa-solid fa-location-dot"></i> {event.location}
          </div>

          <button 
            className={styles.toggleBtn} 
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
          >
            {isDetailsExpanded ? "Hide Details" : "Show More"}
          </button>

          {isDetailsExpanded && (
            <div className={styles.extraDetails}>
              <p><strong>Venue:</strong> {event.location}</p>
              <p className={styles.description}>{event.content}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
