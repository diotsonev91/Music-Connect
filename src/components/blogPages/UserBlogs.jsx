import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import useBlogMutation from "../../hooks/useBlogMutation";
import ConfirmPopup from "../shared/App/ConfirmPopup"; 
import styles from "./UserBlogs.module.css";

const UserBlogs = ({ userId }) => {
  const [blogs, setBlogs] = useState([]);
  const { getUserBlogs, deleteBlogPost } = useBlogMutation();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔁 Popup state
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // 🧠 Fetch blogs
  useEffect(() => {
    const fetchUserBlogs = async () => {
      const userBlogs = await getUserBlogs(userId);
      setBlogs(userBlogs);
    };
    fetchUserBlogs();
  }, [userId, getUserBlogs]);

  const handleEdit = (blogId) => {
    navigate(`/blog/${blogId}/edit`);
  };

  const handleDelete = (blog) => {
    setSelectedBlog(blog);
    setPopupOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBlog) return;
  
    setPopupOpen(false);
  
    const result = await deleteBlogPost(selectedBlog.id, selectedBlog.imageUrl);
  
    if (result.success) {
      setBlogs((prev) => prev.filter((b) => b.id !== selectedBlog.id));
    } else {
      alert("Failed to delete blog.");
    }
  
    setSelectedBlog(null);
  };
  

  const cancelDelete = () => {
    setPopupOpen(false);
    setSelectedBlog(null);
  };

  if (blogs.length === 0) {
    return <p className={styles.noBlogs}>No blogs found for this user.</p>;
  }

  return (
    <div className={styles.blogList}>
      <h3>User's Blogs</h3>

      {blogs.map((blog) => (
        <div key={blog.id} className={styles.blogItem}>
          <div
            className={styles.blogTitle}
            onClick={() => navigate(`/blog/${blog.id}`)}
          >
            {blog.title}
          </div>

          {user?.uid === blog.author?.uid && (
            <div className={styles.actionButtons}>
              <button
                className={styles.editButton}
                onClick={() => handleEdit(blog.id)}
              >
                Edit
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(blog)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      {/* ✅ ConfirmPopup for blog deletion */}
      <ConfirmPopup
        isOpen={popupOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete "${selectedBlog?.title}"?`}
      />
    </div>
  );
};

export default UserBlogs;
