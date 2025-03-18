import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import useBlogMutation from "../../hooks/useBlogMutation";
import styles from "./UserBlogs.module.css";

const UserBlogs = ({ userId }) => {
  const [blogs, setBlogs] = useState([]);
  const { getUserBlogs } = useBlogMutation();
  const navigate = useNavigate(); // ✅ Initialize navigate

  useEffect(() => {
    const fetchUserBlogs = async () => {
      const userBlogs = await getUserBlogs(userId);
      setBlogs(userBlogs);
    };
    fetchUserBlogs();
  }, [userId, getUserBlogs]);

  if (blogs.length === 0) {
    return <p className={styles.noBlogs}>No blogs found for this user.</p>;
  }

  return (
    <div className={styles.blogList}>
      <h3>User's Blogs</h3>
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className={styles.blogItem}
          onClick={() => navigate(`/blog/${blog.id}`)} // ✅ Navigate on click
        >
          {blog.title}
        </div>
      ))}
    </div>
  );
};

export default UserBlogs;
