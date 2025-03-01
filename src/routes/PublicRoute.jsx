import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  
  if (loading) {
    return <div>Loading...</div>; // Prevents flickering issues
  }

  if (user && (location.pathname === "/login" || location.pathname === "/register")) {
    return <Navigate to="/myProfile" />;
  }

  return children;
};

export default PublicRoute;
