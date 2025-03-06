import React, { useState } from "react";
import { motion } from "framer-motion";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import styles from "./EventCard.module.css";

const EventCard = ({ event }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;
  const eventImg = event.image || "/event.png";
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const defaultCenter = { lat: event.lat || 42.6975, lng: event.lng || 23.3242 }; // Sofia, Bulgaria

  console.log("Google Maps API Key:", apiKey);
  console.log("Google Maps Map ID:", mapId);

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
          <p className={styles.description}>{event.description}</p>
          <div className={styles.location}>
            <i className="fa-solid fa-location-dot"></i> {event.location}
          </div>
        </div>

        {/* Google Map using @vis.gl/react-google-maps */}
        {apiKey ? (
          <APIProvider apiKey={apiKey}>
            <div 
              className={isMapExpanded ? styles.mapExpanded : styles.map} 
              onClick={() => setIsMapExpanded(!isMapExpanded)}
            >
              <Map 
                center={defaultCenter} 
                zoom={14} 
                gestureHandling="cooperative"
                className={styles.mapInner} 
                mapId={mapId}
              >
                <AdvancedMarker position={defaultCenter}>
                  <Pin background={"#7c3aed"} glyphColor={"white"} borderColor={"#5a2bbd"} />
                </AdvancedMarker>
              </Map>
            </div>
          </APIProvider>
        ) : (
          <p className={styles.mapError}>Google Maps API Key is missing.</p>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;
