import React, { useState } from "react";
import { useSelector } from "react-redux";
import NotificationList from "./NotificationList";
import styles from "./NotificationIcon.module.css";

const NotificationIcon = () => {
  const [open, setOpen] = useState(false);
  const notifications = useSelector(state => state.notifications.list);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={styles.wrapper} onClick={() => setOpen(!open)}>
      <button className={styles.button}>🔔</button>
      {unreadCount > 0 && <div className={styles.badge}>{unreadCount}</div>}
      {open && <NotificationList />}
    </div>
  );
};

export default NotificationIcon;
