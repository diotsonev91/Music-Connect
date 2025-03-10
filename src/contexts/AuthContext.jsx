import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, logoutUser, listenForAuthChanges } from "../services/firebaseAuth";
import { saveUser } from "../services/firebaseFirestore"; // ✅ Firestore service

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Listen for auth state changes (from firebaseAuth.js)
  useEffect(() => {
    const unsubscribe = listenForAuthChanges((currentUser) => {
      setUser(currentUser); // ✅ Updates React state
      setLoading(false);
      console.log("Auth State Changed: ", currentUser);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Login function (uses service)
  const login = async (email, password) => {
    try {
      if (!email || !password) throw new Error("Email and Password are required!");
      const userCredential = await loginUser(email, password);
      setUser(userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Login Error:", error.message);
      return { success: false, error: error.message };
    }
  };

  // ✅ Register function (uses service)
  const register = async (email, password) => {
    try {
      if (!email || !password) throw new Error("Email and Password are required!");

      const userCredential = await registerUser(email, password);
      const user = userCredential.user;

      // ✅ Store user info in Firestore
      await saveUser(user.uid, { email: user.email, createdAt: new Date() });

      setUser(user);
      return { success: true, user };
    } catch (error) {
      console.error("Registration Error:", error.message);
      return { success: false, error: error.message };
    }
  };

  // ✅ Logout function (uses service)
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null); // Ensure state updates
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
