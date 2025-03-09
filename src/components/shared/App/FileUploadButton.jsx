import React from "react";
import styles from "./FileUploadButton.module.css";

const FileUploadButton = ({ onFileSelect, accept = "image/*", buttonText = "Upload File" }) => {
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      onFileSelect(event.target.files[0]); // Pass selected file to parent component
    }
  };

  return (
    <div>
      <input
        id="fileInput"
        className={styles.hiddenFileInput}
        type="file"
        accept={accept} // Accept different file types
        onChange={handleFileChange}
      />
      <label htmlFor="fileInput" className={styles.fileUploadButton}>
        {buttonText}
      </label>
    </div>
  );
};

export default FileUploadButton;
