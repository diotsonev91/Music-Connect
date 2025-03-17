import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import useBlogMutation from "../../hooks/useBlogMutation";
import BlogForm from "./BlogForm";

const PostBlog = ({ onSubmitSuccess }) => {
  const { user } = useAuth();
  const { saveOrUpdateBlog, isLoading, error, message } = useBlogMutation();

  const handleSubmit = async (formData) => {
    if (!user) return;
    const result = await saveOrUpdateBlog(formData, user);
    if (result.success) {
      onSubmitSuccess && onSubmitSuccess();
    }
  };

  return (
    <div>
      <h1>Create a New Blog Post</h1>
      <BlogForm onSubmit={handleSubmit} loading={isLoading} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default PostBlog;
