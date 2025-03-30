import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, logoutUser, listenForAuthChanges } from "../services/firebaseAuth";
import { addDocument,setDocument } from "../services/firebaseFirestore";

import { useUserProfile } from "../hooks/useUserProfile";
import {
  updateEmail,
  updatePassword,
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchProfileField } = useUserProfile();

  // ✅ Enrich user with Firestore profile data (like displayName)
  const enrichUser = async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      return;
    }
    const profile = await fetchProfileField(firebaseUser.uid);
    setUser({
      ...firebaseUser,
      displayName: profile?.displayName || "Anonymous",
      motto: profile?.motto || "",
      photoURL: profile?.photoURL || firebaseUser.photoURL || "/default_avatar.png",
    });
  };

  // ✅ Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = listenForAuthChanges(async (firebaseUser) => {
      await enrichUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Login function
  const login = async (email, password) => {
    const userCredential = await loginUser(email, password);
    await enrichUser(userCredential.user);
    return userCredential.user;
  };

  // ✅ Register function
  const register = async (email, password) => {
    const userCredential = await registerUser(email, password);
    const user = userCredential.user;
    console.log("USER TO BE REGISTERED ",user)
    await setDocument("users", user.uid, {
      email: user.email,
      createdAt: new Date(),
    });
    await enrichUser(user);
    console.log("REGISTER USER: ",user)
    return user;
  };

  // ✅ Logout function
  const logout = async () => {
    await logoutUser();
    setUser(null);
  };


  const updateCredentials = async ({ email, password, currentPassword }) => {
    const auth = getAuth();
    const firebaseUser = auth.currentUser;
  
    if (!firebaseUser) throw new Error("No authenticated user.");
    if (!currentPassword) throw new Error("Current password is required for security reasons.");
  
    // ✅ Re-authenticate first (Firebase requires this for sensitive updates)
    const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
  
    try {
      await reauthenticateWithCredential(firebaseUser, credential);
    } catch (error) {
      console.log("FIREBASE ERROR", error)
      throw new Error("Re-authentication failed. Please check your current password.");
    }
  
    // ✅ Update email if changed
    if (email && email !== firebaseUser.email) {
      await updateEmail(firebaseUser, email);
  
      
      await setDocument("users", firebaseUser.uid, { email }, true);

    }
  
    // ✅ Update password if provided
    if (password) {
      await updatePassword(firebaseUser, password);
    }
  
    // ✅ Refresh your user data
    await enrichUser(firebaseUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateCredentials }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for easy access to AuthContext
function useAuth() {
  return useContext(AuthContext);
}

export { useAuth };
