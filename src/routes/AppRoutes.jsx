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
import TrackPage from "../components/musicPages/TrackPage";
import { TrackCommentProvider } from "../contexts/TrackCommentContext"; 
import PlaylistPage from "../components/musicPages/PlaylistPage";
import BlogsPage from "../components/blogPages/BlogsPage";
import BlogDetails from "../components/blogPages/BlogDetails";
import PostBlog from "../components/blogPages/PostBlog";
import EditBlog from "../components/blogPages/EditBlog";
import UploadTrack from "../components/musicPages/UploadTrack";
import EditTrack from "../components/musicPages/EditTrack";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes wrapped with Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="blog" element={<BlogMain />} />
        <Route path="music" element={<MusicPage />} />
        <Route path="playlist/:genre" element={<PlaylistPage />} />
        <Route path="blogs/:category" element={<BlogsPage />} />

        {/* ✅ Separate Route for Blog Details */}
        <Route path="blog/:id" element={<BlogDetails />} />
        
        {/* ✅ Separate Route for Editing Blog */}
        <Route
          path="blog/:id/edit"
          element={
            <ProtectedRoute>
              <EditBlog />
            </ProtectedRoute>
          }
        />

        {/* ✅ Separate Route for Track Details */}
        <Route
          path="track/:id"
          element={
            <TrackCommentProvider>
              <TrackPage />
            </TrackCommentProvider>
          }
        />

        {/* ✅ Separate Route for Editing Track */}
        <Route
          path="track/:id/edit"
          element={
            <ProtectedRoute>
              <EditTrack />
            </ProtectedRoute>
          }
        />

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
        <Route
          path="blog_post"
          element={
            <ProtectedRoute>
              <PostBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="track/upload"
          element={
            <ProtectedRoute>
              <UploadTrack />
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
