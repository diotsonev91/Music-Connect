import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router";
  import Layout from "../components/shared/App/Layout";
  import LoginPage from "../components/authPages/LoginPage";
  import RegisterPage from "../components/authPages/RegisterPage";
  import ProfilePage from "../components/profilePages/ProfilePage";
  import ChatPage from "../components/chatPages/ChatPage";
  import HomePage from "../components/homePages/HomePage";
  import BlogsMain from "../components/blogPages/BlogsMain";
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
  import HelpCenter from "../components/shared/App/HelpCenter";
  
  import ProtectedRoute from "./ProtectedRoute";
  import PublicRoute from "./PublicRoute";
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "blogs", element: <BlogsMain /> },
        { path: "music", element: <MusicPage /> },
        { path: "playlist", element: <PlaylistPage /> },
        { path: "playlist/:playlistTitle", element: <PlaylistPage /> },
        { path: "blogs/:category", element: <BlogsPage /> },
        { path: "artists", element: <Artists /> },
        { path: "help-center", element: <HelpCenter /> },
        { path: "blog/:id", element: <BlogDetails /> },
        {
          path: "blog/:id/edit",
          element: (
            <ProtectedRoute>
              <EditBlog />
            </ProtectedRoute>
          ),
        },
        {
          path: "track/:id",
          element: (
            <TrackCommentProvider>
              <TrackPage />
            </TrackCommentProvider>
          ),
        },
        {
          path: "track/:id/edit",
          element: (
            <ProtectedRoute>
              <EditTrack />
            </ProtectedRoute>
          ),
        },
        { path: "profile/:uid", element: <ProfilePage /> },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile/edit-user",
          element: (
            <ProtectedRoute>
              <EditUserPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "chat",
          element: (
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "chat/:chatId",
          element: (
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "blog_post",
          element: (
            <ProtectedRoute>
              <PostBlog />
            </ProtectedRoute>
          ),
        },
        {
          path: "track/upload",
          element: (
            <ProtectedRoute>
              <UploadTrack />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      ),
    },
    {
      path: "/register",
      element: (
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      ),
    },
  ]);
  
  export default router;
  