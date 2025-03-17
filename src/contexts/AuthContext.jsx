import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, logoutUser, listenForAuthChanges } from "../services/firebaseAuth";
import { addDocument } from "../services/firebaseFirestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = listenForAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Login function (no try/catch, handled in components)
  const login = async (email, password) => {
    const userCredential = await loginUser(email, password);
    setUser(userCredential.user);
    return userCredential.user;
  };

  // ✅ Register function (no try/catch, handled in components)
  const register = async (email, password) => {
    const userCredential = await registerUser(email, password);
    const user = userCredential.user;

    // ✅ Store user info in Firestore
    await addDocument("users", { uid: user.uid, email: user.email, createdAt: new Date() });

    setUser(user);
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
