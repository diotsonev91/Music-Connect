import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { fetchBlogPost, updateBlogPost } from "../../services/firebaseBlogService";
import { uploadFile } from "../../services/firebaseStorage";
import BlogForm from "./BlogForm";
import { useParams } from "react-router-dom";

const EditBlog = ({ onSubmitSuccess }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [blogData, setBlogData] = useState(null);

  useEffect(() => {
    const loadBlog = async () => {
      const data = await fetchBlogPost(id);
      if (data) setBlogData(data);
    };
    loadBlog();
  }, [id]);

  const handleSubmit = async (formData) => {
    if (!user) {
      setMessage("User not logged in.");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = formData.image ? await uploadFile(formData.image, "blog_images") : formData.imageUrl;
      await updateBlogPost(id, { ...formData, imageUrl });

      setMessage("Blog updated successfully!");
      onSubmitSuccess && onSubmitSuccess();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
    setLoading(false);
  };

  return blogData ? <BlogForm initialData={blogData} onSubmit={handleSubmit} loading={loading} /> : <p>Loading...</p>;
};

export default EditBlog;
