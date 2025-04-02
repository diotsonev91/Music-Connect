// src/components/shared/Buttons/AddButton.jsx
import React from "react";
import { useNavigate } from "react-router";
import styles from "./AddButton.module.css";

export default function AddButton({ to, text = "+ Add", onClick, className = "" ,   disabled = false}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick(); // custom callback
    } else if (to) {
      navigate(to); // fallback to navigation
    }
  };

  return (
    <button className={`${styles.addButton} ${className}`} onClick={handleClick}>
      {text}
    </button>
  );
}
