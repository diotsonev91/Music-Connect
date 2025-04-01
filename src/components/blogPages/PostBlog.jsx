import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import useBlogMutation from "../../hooks/useBlogMutation";
import BlogForm from "./BlogForm";
import { useNavigate } from "react-router-dom"; // ✅ Import this

const PostBlog = ({ onSubmitSuccess }) => {
  const { user } = useAuth();
  const { saveOrUpdateBlog, isLoading, error, message } = useBlogMutation();
  const navigate = useNavigate(); // ✅ Setup navigate

  const handleSubmit = async (formData) => {
    if (!user) return;

    const result = await saveOrUpdateBlog(formData, user);
    console.log("RESULT OF BLOG POST",result)
    if (result.success && result.id) {
      navigate(`/blog/${result.id}`); 
      onSubmitSuccess && onSubmitSuccess(); // optional callback
    }
  };

  return (
    <div>
      
      <BlogForm onSubmit={handleSubmit} loading={isLoading} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default PostBlog;
