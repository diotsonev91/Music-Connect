import React, { useId } from "react";
import styles from "./FileUploadButton.module.css";

const FileUploadButton = ({ onFileSelect, accept = "image/*", buttonText = "Upload File" }) => {
  const uniqueId = useId(); // ✅ Generate a unique id for each instance

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      onFileSelect(event.target.files[0]); // Pass selected file to parent component
    }
  };

  return (
    <div>
      <input
        id={`fileInput-${uniqueId}`} // ✅ Unique ID for each button
        className={styles.hiddenFileInput}
        type="file"
        accept={accept} // ✅ Accept different file types correctly
        onChange={handleFileChange}
      />
      <label htmlFor={`fileInput-${uniqueId}`} className={styles.fileUploadButton}>
        {buttonText}
      </label>
    </div>
  );
};

export default FileUploadButton;
