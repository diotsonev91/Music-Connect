import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPenNib, faCalendarAlt, faEye, faComment } from "@fortawesome/free-solid-svg-icons";
import useBlogMutation from "../../hooks/useBlogMutation";
import styles from "./BlogDetails.module.css";

const BlogDetails = () => {
  const { id } = useParams(); // ✅ Get the blog ID from the URL
  const { getBlog } = useBlogMutation();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // ✅ Fetch the blog on mount
  useEffect(() => {
    const fetchBlog = async () => {
      const blogData = await getBlog(id);
      if (blogData) {
        setBlog(blogData);
        setComments(blogData.comments || []);
      }
    };
    fetchBlog();
  }, [id, getBlog]);

  if (!blog) {
    return <p className={styles.error}>Loading blog or blog not found.</p>;
  }

  const avatarSrc = blog.avatar || "/default_avatar.png";
  const blogImg = blog.imageUrl || "/header.png";

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    const updatedComments = [...comments, { text: newComment, date: new Date().toLocaleString() }];
    setComments(updatedComments);
    setNewComment("");
  };

  return (
    <div className={styles.blogContainer}>
      <div className={styles.blogCard}>
        <img src={blogImg} alt={blog.title} className={styles.image} />

        <div className={styles.details}>
          <img src={avatarSrc} alt="avatar" className={styles.avatar} />
          <div className={styles.info}>
            <h2 className={styles.title}>{blog.title}</h2>
            <p className={styles.category}><FontAwesomeIcon icon={faBook} /> {blog.category}</p>
            <p className={styles.publisher}><FontAwesomeIcon icon={faPenNib} /> By {blog.author?.displayName || "Unknown"}</p>
            <p className={styles.date}><FontAwesomeIcon icon={faCalendarAlt} /> Posted on {new Date(blog.createdAt?.seconds * 1000).toLocaleDateString()}</p>
            <p className={styles.stats}><FontAwesomeIcon icon={faEye} /> {blog.views || 0} views • {comments.length} comments</p>
          </div>
        </div>

        <div className={styles.content}>
          <p>{blog.content}</p>
        </div>

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
