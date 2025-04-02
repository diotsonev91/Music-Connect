import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { markAsRead } from "../../redux/notificationSlice";
import { useNavigate } from "react-router";
import styles from "./NotificationList.module.css";

const NotificationList = () => {
  const notifications = useSelector((state) => state.notifications.list);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString(); // Change format as needed
  };

  // ✅ LOGGING for debug
  console.log("🔔 Notifications inside NotificationList:", notifications);

  const handleNotificationClick = (notif) => {
    // ✅ Mark notification as read
    dispatch(markAsRead(notif.id));

    // ✅ Redirect based on notification type
    switch (notif.type) {
      case "chat":
        navigate(`/chat/${notif.data.chatId}`);
        break;
      case "track":
        navigate(`/track/${notif.data.trackId}`);
        break;
      case "blog":
        navigate(`/blog/${notif.data.blogId}`);
        break;
      default:
        console.warn("Unknown notification type");
    }
  };

  if (notifications.length === 0) {
    return <div className={styles.dropdown}>No notifications</div>;
  }

  return (
    <div className={styles.dropdown}>
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`${styles.item} ${notif.read ? styles.read : styles.unread}`}
          onClick={() => handleNotificationClick(notif)}
        >
          {notif.text}
          <span className={styles.timestamp}>{formatTimestamp(notif.timestamp)}</span>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
