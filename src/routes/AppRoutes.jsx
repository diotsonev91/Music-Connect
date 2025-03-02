import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Layout from "../components/shared/App/Layout";
import LoginPage from "../components/authPages/LoginPage";
import RegisterPage from "../components/authPages/RegisterPage";
import MyProfile from "../components/profilePages/MyProfilePage";
import ChatPage from "../components/chatPages/ChatPage";
import HomePage from "../components/homePages/HomePage";
import BlogMain from "../components/blogPages/BlogMain";
import MusicPage from "../components/musicPages/MusicPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes wrapped with Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="blog" element={<BlogMain />} />
        <Route path="music" element={<MusicPage />} />

        {/* Private routes inside Layout */}
        <Route
          path="myProfile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Auth pages without Layout */}
      <Route
        path="login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
