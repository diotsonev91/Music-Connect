import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/shared/loaders/Loader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
