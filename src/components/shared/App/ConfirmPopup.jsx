import React from "react";
import styles from "./ConfirmPopup.module.css";

const ConfirmPopup = ({ isOpen, onClose, onConfirm, message = "Are you sure?" }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <p>{message}</p>
        <div className={styles.popupActions}>
          <button className={styles.confirmBtn} onClick={onConfirm}>Yes</button>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
