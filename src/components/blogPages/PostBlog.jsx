import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { createBlogPost } from "../../services/firebaseBlogService";
import { uploadFile } from "../../services/firebaseStorage";
import BlogForm from "./BlogForm";

const PostBlog = ({ onSubmitSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (formData) => {
    if (!user) {
      setMessage("User not logged in.");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = formData.image ? await uploadFile(formData.image, "blog_images") : formData.imageUrl;
      await createBlogPost({ ...formData, imageUrl, author: { uid: user.uid, email: user.email, displayName: user.displayName || "Anonymous" } });

      setMessage("Blog post created successfully!");
      onSubmitSuccess && onSubmitSuccess();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
    setLoading(false);
  };

  return <BlogForm onSubmit={handleSubmit} loading={loading} />;
};

export default PostBlog;
