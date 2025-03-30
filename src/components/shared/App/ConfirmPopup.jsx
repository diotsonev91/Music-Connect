import React, { useState } from "react";
import styles from "./ConfirmPopup.module.css";

const ConfirmPopup = ({
  isOpen,
  onClose,
  onConfirm,
  message = "Are you sure?",
  isAccountDeleteConfirm = false
}) => {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleConfirmClick = () => {
    if (isAccountDeleteConfirm) {
      onConfirm(password); // pass password to handler
    } else {
      onConfirm();
    }
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <p>{message}</p>

        {isAccountDeleteConfirm && (
          <div className={styles.passwordSection}>
            <label>To delete your account, enter your password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.passwordInput}
              placeholder="Your password"
            />
          </div>
        )}

        <div className={styles.popupActions}>
          <button className={styles.confirmBtn} onClick={handleConfirmClick}>
            Yes
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
