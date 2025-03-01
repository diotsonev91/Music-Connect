import React from "react";
import { useAuth } from "../../contexts/AuthContext";


const MyProfile = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center", padding: "20px" }}>
      <h2>👤 My Profile</h2>

      {/* Profile Image */}
      {user?.photoURL ? (
        <img src={user.photoURL} alt="Profile" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
      ) : (
        <img src="/default_avatar.png" alt="Default Avatar" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
      )}

      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>UID:</strong> {user?.uid}</p>

      <p style={{ color: "green", fontWeight: "bold" }}>✅ Protected Route Works</p>
    
      <button 
        onClick={logout} 
      >
         Logout
      </button>
    </div>
  );
};

export default MyProfile;
