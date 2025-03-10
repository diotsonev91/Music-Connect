import React, { useState, useEffect } from "react";
import styles from "./TrackForm.module.css";
import FileUploadButton from "../shared/App/FileUploadButton";
import FormInput from "../shared/Form/FormInput"; 

const genres = [
  { name: "Hip Hop" },
  { name: "Pop" },
  { name: "Rock" },
  { name: "Etnic" },
  { name: "Classical" },
  { name: "Acoustic" }
];

const TrackForm = ({ initialData = {}, onSubmit, loading, setTrackImageURL, setBackgroundImageURL }) => {
  // ✅ Store original data separately
  const [originalData, setOriginalData] = useState(initialData);
  
  // ✅ Store user-edited form data
  const [formData, setFormData] = useState({
    trackName: "",
    genre: "Hip Hop",
    trackFile: null,
    trackFileUrl: "",
    trackImage: null,
    trackImageUrl: "",
    backgroundImage: null,
    backgroundImageUrl: "",
  });

  // ✅ Update `formData` only when `initialData` changes
  useEffect(() => {
    if (JSON.stringify(initialData) !== JSON.stringify(originalData)) {
      setFormData({
        trackName: initialData.trackName || "",
        genre: initialData.genre || "Hip Hop",
        trackFileUrl: initialData.trackFileUrl || "",
        trackImageUrl: initialData.trackImageUrl || "",
        backgroundImageUrl: initialData.backgroundImageUrl || "",
        trackFile: null,
        trackImage: null,
        backgroundImage: null,
      });

      // ✅ Update previews in parent components
      if (setTrackImageURL) setTrackImageURL(initialData.trackImageUrl || "");
      if (setBackgroundImageURL) setBackgroundImageURL(initialData.backgroundImageUrl || "");

      // ✅ Sync original data to prevent unnecessary updates
      setOriginalData(initialData);
    }
  }, [initialData]);

  // 🔹 Handle file selection
  const handleFileSelect = (file, type) => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, [type]: file, [`${type}Url`]: fileURL }));

      if (type === "trackImage" && setTrackImageURL) setTrackImageURL(fileURL);
      if (type === "backgroundImage" && setBackgroundImageURL) setBackgroundImageURL(fileURL);
    }
  };

  // 🔹 Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.trackForm}>
        {/* Track Name */}
        <FormInput
          value={formData.trackName}
          setValue={(value) => setFormData((prev) => ({ ...prev, trackName: value }))}
          label="Track Name"
          type="text"
          isRequired={true}
          helperText="Track name should be between 4-30 characters."
        />

        {/* Genre Selection */}
        <select 
          className={styles.select} 
          value={formData.genre} 
          onChange={(e) => setFormData((prev) => ({ ...prev, genre: e.target.value }))}
        >
          {genres.map((genre) => (
            <option key={genre.name} value={genre.name}>
              {genre.name}
            </option>
          ))}
        </select>

        {/* File Uploads */}
        <FileUploadButton accept="audio/*" buttonText="Upload Track" onFileSelect={(file) => handleFileSelect(file, "trackFile")} />
        <FileUploadButton accept="image/*" buttonText="Track Image" onFileSelect={(file) => handleFileSelect(file, "trackImage")} />
        <FileUploadButton accept="image/*" buttonText="Background" onFileSelect={(file) => handleFileSelect(file, "backgroundImage")} />

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Submitting..." : initialData?.trackName ? "Update Track" : "Upload Track"}
        </button>
      </form>
    </div>
  );
};

export default TrackForm;
