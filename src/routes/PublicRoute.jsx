import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/shared/loaders/Loader";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  
  if (loading) {
    return <Loader />;
  }

  if (user && (location.pathname === "/login" || location.pathname === "/register")) {
    return <Navigate to="/profile" />;
  }

  return children;
};

export default PublicRoute;
