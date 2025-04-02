// src/pages/profile/EditUserPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

import FormBox from "../../components/shared/Form/FormBox";
import styles from "./EditUserPage.module.css";

const EditUserPage = () => {
  const { user, updateCredentials } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    
  const handleSubmit = async ({ email, password, currentPassword }) => {
    setError("");
    setLoading(true);
  
    try {
      await updateCredentials({ email, password,currentPassword });
  
      alert("User credentials updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.editUserWrapper}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>🔐 Edit Email & Password</h2>
        <FormBox
          formType="edit"
          onSubmit={handleSubmit}
          isLoading={loading}
          error={error}
          initialCreds={{ email: user?.email || "" }}
        />
        <button onClick={() => navigate("/profile")} className={styles.backButton}>
          ← Back to Profile
        </button>
      </div>
    </div>
  );
};

export default EditUserPage;
