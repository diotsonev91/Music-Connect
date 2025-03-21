import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or skeleton UI
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
