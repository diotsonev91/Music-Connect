import React, { useState, useEffect } from "react";
import styles from "./TrackForm.module.css";
import FileUploadButton from "../shared/App/FileUploadButton";
import FormInput from "../shared/Form/FormInput";
import { useDispatch } from "react-redux";
import { stopTrack } from "../../redux/playerSlice";

const genres = [
  { name: "Hip Hop" },
  { name: "Pop" },
  { name: "Rock" },
  { name: "Etnic" },
  { name: "Classical" },
  { name: "Acoustic" }
];

export default function TrackForm({ trackData={}, onSubmit, loading, setTrackData }) {
  const [errors, setErrors] = useState({ trackName: "", trackFile: "", genre: "" });
  const [isFormValid, setIsFormValid] = useState(false);
  const [trackName, setTrackName] = useState(trackData.trackName || "");
  const [trackFileUrl, setTrackFileUrl] = useState(trackData.trackFileUrl || "");
  const [genre, setGenre] = useState("Select Genre");
  const dispatch = useDispatch();
  const [touched, setTouched] = useState({
    trackName: false,
    trackFile: false,
    genre: false
  });

  useEffect(() => {
    console.log("track data inside trackform use effect",trackData)
    if (trackData) {
      setTrackName(trackData.trackName || "");
      setTrackFileUrl(trackData.trackFileUrl || "");
      setGenre(trackData.genre || "Select Genre");
    }
  }, []);

  // ✅ Validation functions
  const validateTrackName = (name) => {
    if (!name) return "Track Name is required";
    if (name.trim().length < 4) return "Track name must be at least 4 characters";
    return "";
  };

  const validateTrackFile = () => {
    if (!trackFileUrl) return "Track audio file is required";
    return "";
  };

  const validateGenre = (selectedGenre) => {
    if (selectedGenre === "Select Genre") return "Please select a genre";
    return "";
  };

  // ✅ Sync states and validate
  useEffect(() => {
    setTrackData((prev) => ({
      ...prev,
      trackName,
      genre: genre !== "Select Genre" ? genre : "",
    }));

    setErrors({
      trackName: validateTrackName(trackName),
      trackFile: validateTrackFile(),
      genre: validateGenre(genre),
    });
    console.log("TRACK Data :  ", trackData)
  }, [trackName, trackFileUrl, genre]);

  // ✅ Determine form validity
  useEffect(() => {
    setIsFormValid(!errors.trackName && !errors.trackFile && !errors.genre);
  }, [errors]);

  const handleFileSelect = (file, type) => {
    if (file) {
      if (type === "trackFile") {
        dispatch(stopTrack());
        setTouched((prev) => ({ ...prev, trackFile: true }));
        setTrackFileUrl(URL.createObjectURL(file));
      }
  
      setTrackData((prev) => ({
        ...prev,
        [type]: file,
        [`${type}Url`]: URL.createObjectURL(file),
      }));
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(stopTrack());
    if (onSubmit.length === 0) {
      
      onSubmit();
    } else {
     
      onSubmit(trackData);
    }
  };
  

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.trackForm}>
        {/* Track Name */}
        <div className={styles.trackNameField}>       
           <FormInput
          value={trackName}
          setValue={(val) => {
            setTrackName(val);
            setTouched((prev) => ({ ...prev, trackName: true }));
          }}
          label="Track Name"
          placeholder="track name"
          type="text"
          isRequired={true}
          errorText={errors.trackName}
          helperText="Track name should be between 4-30 characters."
          validate={validateTrackName}
        />
        </div>

        <div className={styles.wrapper2}>

        {/* Genre */}
        {touched.genre && errors.genre && <span className={styles.audioRequired}>{errors.genre}</span>}
        <div className={styles.selectDiv}>
        <p>*</p>
        <select
          className={styles.select}
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value)
            //console.log("Selected genre:", e.target.value); // 
          }
          }
          onBlur={() => setTouched((prev) => ({ ...prev, genre: true }))}
        >
          <option value="Select Genre" disabled>Select Genre</option>
          {genres.map((g) => (
            <option key={g.name} value={g.name}>{g.name}</option>
          ))}
        </select>
        </div>
     

        {/* File Upload */}
        {touched.trackFile && errors.trackFile && <span className={styles.audioRequired}>{errors.trackFile}</span>}
        <FileUploadButton
          accept="audio/*"
          buttonText={trackData?.trackName ? "Replace Track" : "*Upload Track"}
          onFileSelect={(file) => handleFileSelect(file, "trackFile")}
          width="wide"
          onClick={() => {
            setTimeout(() => {
              setTouched((prev) => ({ ...prev, trackFile: true }));
            }, 1000); 
          }}
        />

          <FileUploadButton
            accept="image/*"
            buttonText={trackData?.trackName ? "Replace Image" : "Track Image"}
            onFileSelect={(file) => handleFileSelect(file, "trackImage")}
            width="wide"
          />

          <FileUploadButton
            accept="image/*"
            buttonText={trackData?.trackName ? "Change Background" : "Background"}
            onFileSelect={(file) => handleFileSelect(file, "backgroundImage")}
            width="wide"
          />

        <button type="submit" className={styles.submitButton} disabled={loading || !isFormValid}>
          {loading ? "Submitting..." : trackData?.trackName ? "Update Track" : "Upload Track"}
        </button>
        </div>
      </form>
    </div>
  );
}
