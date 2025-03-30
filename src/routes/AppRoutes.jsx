import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Layout from "../components/shared/App/Layout";
import LoginPage from "../components/authPages/LoginPage";
import RegisterPage from "../components/authPages/RegisterPage";
import ProfilePage from "../components/profilePages/ProfilePage";
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
import Artists from "../components/musicPages/Artists";
import EditUserPage from "../components/profilePages/EditUserPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes wrapped with Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="blog" element={<BlogMain />} />
        <Route path="music" element={<MusicPage />} />
        <Route path="playlist/:playlistTitle" element={<PlaylistPage />} />
        <Route path="playlist" element={<PlaylistPage />} />
        <Route path="blogs/:category" element={<BlogsPage />} />
        <Route path="artists" element={<Artists/>} />
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


          <Route
          path="profile/:uid"
          element={
              <ProfilePage />
          }
        />
        {/* Private routes inside Layout */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
          
        />
           <Route
          path="profile/edit-user"
          element={
            <ProtectedRoute>
              <EditUserPage />
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
          path="chat/:chatId"
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
