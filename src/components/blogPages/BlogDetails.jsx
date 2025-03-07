import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // ✅ Get blog from navigation state
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPenNib, faCalendarAlt, faEye, faComment } from "@fortawesome/free-solid-svg-icons";
import styles from "./BlogDetails.module.css";

const BlogDetails = () => {
  const location = useLocation();
  const blog = location.state; // ✅ Get blog from navigation state

  // Handle case where no blog is found (e.g., direct URL access)
  if (!blog) {
    return <p className={styles.error}>Error: Blog not found.</p>;
  }

  const avatarSrc = blog.avatar || "/default_avatar.png";
  const blogImg = blog.image || "/header.png";

  // State to manage comments
  const [comments, setComments] = useState(blog.comments || []);
  const [newComment, setNewComment] = useState("");

  // Function to handle comment submission
  const handleAddComment = () => {
    if (newComment.trim() === "") return; // Prevent empty comments
    const updatedComments = [...comments, { text: newComment, date: new Date().toLocaleString() }];
    setComments(updatedComments);
    setNewComment("");
  };

  return (
    <div className={styles.blogContainer}>
      <div className={styles.blogCard}>
        {/* Blog Image */}
        <img src={blogImg} alt={blog.title} className={styles.image} />

        {/* Blog Details */}
        <div className={styles.details}>
          <img src={avatarSrc} alt="avatar" className={styles.avatar} />
          <div className={styles.info}>
            <h2 className={styles.title}>{blog.title}</h2>
            <p className={styles.category}><FontAwesomeIcon icon={faBook} /> {blog.category}</p>
            <p className={styles.publisher}><FontAwesomeIcon icon={faPenNib} /> By {blog.publisher}</p>
            <p className={styles.date}><FontAwesomeIcon icon={faCalendarAlt} /> Posted on {blog.datePosted}</p>
            <p className={styles.stats}><FontAwesomeIcon icon={faEye} /> {blog.views} views • {blog.replies} replies</p>
          </div>
        </div>

        {/* Blog Content */}
        <div className={styles.content}>
          <p>{blog.content}</p>
        </div>

        {/* Comments Section */}
        <div className={styles.commentsSection}>
          <h3><FontAwesomeIcon icon={faComment} /> Comments</h3>
          {comments.length === 0 ? (
            <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
          ) : (
            <ul className={styles.commentsList}>
              {comments.map((comment, index) => (
                <li key={index} className={styles.comment}>
                  <p>{comment.text}</p>
                  <span className={styles.commentDate}>{comment.date}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Add Comment Form */}
          <div className={styles.addComment}>
            <textarea 
              className={styles.commentInput}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className={styles.commentButton} onClick={handleAddComment}>Add Comment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
