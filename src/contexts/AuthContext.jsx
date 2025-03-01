import React, { createContext, useContext, useEffect, useState } from "react";
import { auth,db } from "../firebaseConfig";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { setPersistence, browserSessionPersistence } from "firebase/auth";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      //debug 
      console.log("Auth State Changed: ", user);
    });
    return () => unsubscribe();
  }, []);

  
  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error("Email and Password are required!");
      }
  
      await setPersistence(auth, browserSessionPersistence); // This makes it session-based
  
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
  
      return { success: true, user };
    } catch (error) {
      console.error("Login Error:", error.message);
      return { success: false, error: error.message };
    }
  };
  
  const register = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error("Email and Password are required!");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
      });

      return { success: true, user };
    } catch (error) {
      console.error("Registration Error:", error.message);
      return { success: false, error: error.message };
    }
  };
   
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Ensure the state updates immediately
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


export const useAuth = () => useContext(AuthContext);
