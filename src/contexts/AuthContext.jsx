import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, logoutUser, listenForAuthChanges } from "../services/firebaseAuth";
import { addDocument } from "../services/firebaseFirestore";
import { useUserProfile } from "../hooks/useUserProfile";

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
    await addDocument("users", { uid: user.uid, email: user.email, createdAt: new Date() });
    await enrichUser(user);
    return user;
  };

  // ✅ Logout function
  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for easy access to AuthContext
export const useAuth = () => useContext(AuthContext);
