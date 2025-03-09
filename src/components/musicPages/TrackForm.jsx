import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../../firebaseConfig";
import { collection, addDoc, updateDoc, doc, serverTimestamp, getDocs } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
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

const TrackForm = ({ existingTrack = null, onSubmitSuccess }) => {
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

  const [errors, setErrors] = useState({ trackName: "" });
  const [uploadProgress, setUploadProgress] = useState({ trackFile: 0, trackImage: 0, backgroundImage: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistOptions, setShowPlaylistOptions] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  useEffect(() => {
    if (existingTrack) {
      setFormData({
        trackName: existingTrack.trackName,
        genre: existingTrack.genre || "Hip Hop",
        trackFileUrl: existingTrack.trackFileUrl || "",
        trackImageUrl: existingTrack.trackImageUrl || "",
        backgroundImageUrl: existingTrack.backgroundImageUrl || "",
        trackFile: null,
        trackImage: null,
        backgroundImage: null,
      });
    }

    // Fetch existing playlists
    const fetchPlaylists = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const playlistRef = collection(db, "playlists");
      const playlistSnap = await getDocs(playlistRef);
      const userPlaylists = playlistSnap.docs
        .filter(doc => doc.data().ownerId === user.uid)
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setPlaylists(userPlaylists);
    };

    fetchPlaylists();
  }, [existingTrack]);

  // 🔹 Update formData
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Validation functions
  const validateTrackName = (value) => {
    if (value.length < 4) return "Track name must be at least 4 characters.";
    if (value.length > 30) return "Track name must be at most 30 characters.";
    return "";
  };

  // 🔹 Handle file uploads (Track, Track Image, Background Image)
  const uploadFile = async (file, path, type) => {
    if (!file) return formData[`${type}Url`]; 

    const fileRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({ ...prev, [type]: progress }));
        },
        (error) => reject(error),
        async () => {
          const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prev) => ({ ...prev, [`${type}Url`]: fileUrl })); 
          resolve(fileUrl);
        }
      );
    });
  };

  // 🔹 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trackNameError = validateTrackName(formData.trackName);
    if (trackNameError) {
      setErrors({ trackName: trackNameError });
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const user = auth.currentUser;
      if (!user) {
        setMessage("User not logged in.");
        setLoading(false);
        return;
      }

      const trackFileUrl = await uploadFile(formData.trackFile, "tracks", "trackFile");
      const trackImageUrl = await uploadFile(formData.trackImage, "track_images", "trackImage");
      const backgroundImageUrl = await uploadFile(formData.backgroundImage, "background_images", "backgroundImage");

      if (existingTrack) {
        await updateDoc(doc(db, "tracks", existingTrack.id), {
          trackName: formData.trackName,
          genre: formData.genre,
          trackFileUrl,
          trackImageUrl,
          backgroundImageUrl,
          updatedAt: serverTimestamp(),
        });

        setMessage("Track updated successfully!");
      } else {
        await addDoc(collection(db, "tracks"), {
          trackName: formData.trackName,
          genre: formData.genre,
          trackFileUrl,
          trackImageUrl,
          backgroundImageUrl,
          author: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "Anonymous",
          },
          createdAt: serverTimestamp(),
        });

        setMessage("Track uploaded successfully!");
      }

      setUploadProgress({ trackFile: 0, trackImage: 0, backgroundImage: 0 });
      setFormData({ trackName: "", genre: "Hip Hop", trackFileUrl: "", trackImageUrl: "", backgroundImageUrl: "", trackFile: null, trackImage: null, backgroundImage: null });
      onSubmitSuccess && onSubmitSuccess();
    } catch (error) {
      setMessage("Error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className={styles.wrapper}>
      
      <form onSubmit={handleSubmit} className={styles.trackForm}>
        
        {/* Track Name */}
        <div className={styles.field}>
          <label className={styles.label}>Track Name:</label>
          <FormInput
            value={formData.trackName}
            setValue={(value) => handleChange("trackName", value)}
            label="Track Name"
            type="text"
            isRequired={true}
            helperText="Track name should be between 4-30 characters."
            validate={validateTrackName}
            formType="track"
          />
        </div>

        {/* Genre Selection */}
        <div className={styles.field}>
          <label className={styles.label}>Genre:</label>
          <select 
            className={styles.select} 
            value={formData.genre} 
            onChange={(e) => handleChange("genre", e.target.value)}
          >
            {genres.map((genre) => (
              <option key={genre.name} value={genre.name}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload Buttons */}
        <FileUploadButton accept="audio/*" buttonText="Track" onFileSelect={(file) => handleChange("trackFile", file)} />
        <FileUploadButton accept="image/*" buttonText="Track Image" onFileSelect={(file) => handleChange("trackImage", file)} />
        <FileUploadButton accept="image/*" buttonText="Background" onFileSelect={(file) => handleChange("backgroundImage", file)} />

        {/* Add to Playlist */}
        <button type="button" className={styles.button} onClick={() => setShowPlaylistOptions(!showPlaylistOptions)}>
          Add to Playlist
        </button>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Submitting..." : existingTrack ? "Update Track" : "Upload Track"}
        </button>

        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

export default TrackForm;
