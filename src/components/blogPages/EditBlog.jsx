import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useBlogMutation from "../../hooks/useBlogMutation";
import BlogForm from "./BlogForm";
import { useParams, useNavigate } from "react-router-dom";

const EditBlog = ({ onSubmitSuccess }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveOrUpdateBlog, deleteBlogPost, getBlog, isLoading, error, message } = useBlogMutation();
  const [blogData, setBlogData] = useState(null);

  // ✅ Fetch existing blog data
  useEffect(() => {
    const loadBlog = async () => {
      const data = await getBlog(id);
      if (data) setBlogData(data);
    };
    loadBlog();
  }, [id]);

  const handleSubmit = async (formData) => {
    if (!user) return;
    const result = await saveOrUpdateBlog(formData, user, id);
    if (result.success) {
      onSubmitSuccess && onSubmitSuccess();
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    const result = await deleteBlogPost(id, blogData.imageUrl);
    if (result.success) {
      alert("Blog deleted successfully!");
      navigate("/blogs"); // Redirect after deletion
    }
  };

  return blogData ? (
    <div>
      <h1>Edit Blog Post</h1>
      <BlogForm initialData={blogData} onSubmit={handleSubmit} loading={isLoading} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}

      {/* ✅ Delete Button */}
      <button onClick={handleDelete} style={{ background: "red", color: "white", marginTop: "20px" }}>
        Delete Blog
      </button>
    </div>
  ) : <p>Loading...</p>;
};

export default EditBlog;
