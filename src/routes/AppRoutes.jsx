import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import LoginPage from "../components/authPages/LoginPage";
import RegisterPage from "../components/authPages/RegisterPage";
import MyProfile from "../components/profilePages/MyProfilePage";
import ChatPage from "../components/chatPages/ChatPage";
import HomePage from "../components/homePages/HomePage"
import BlogMain from "../components/blogPages/BlogMain";

const AppRoutes = () => {
  return (
    <Routes>
        {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/blog" element={<BlogMain />} />


        {/* Private routes */}
      <Route path="/myProfile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />


    </Routes>
  );
};

export default AppRoutes;
