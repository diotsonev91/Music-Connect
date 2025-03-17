import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPenNib, faCalendarAlt, faEye } from "@fortawesome/free-solid-svg-icons";
import styles from "./BlogCard.module.css";

const BlogCard = ({ blog }) => {

  const navigate = useNavigate();

  const avatarSrc = blog.avatar || "/default_avatar.png";
  const blogImg = blog.imageUrl || "/header.png"

  console.log("BLOG: ", blog)
  const handleReadMore = () => {
    navigate(`/blog/${blog.id}`, { state: blog });
  };

  const createdAtDate = blog.createdAt?.seconds
  ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString("en-GB")
  : "Loading...";
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }} 
      transition={{ duration: 0.2 }}
      className={styles.cardContainer}
    >
      <div className={styles.card}>
        <img src={blogImg} alt={blog.title} className={styles.image} />
        <div className={styles.details}>
          <img src={avatarSrc} alt="avatar" className={styles.avatar} />
          <div className={styles.info}>
            <h3 className={styles.title}>{blog.title}</h3>
            <p className={styles.category}><FontAwesomeIcon icon={faBook} /> Category: {blog.category}</p>
            <p className={styles.publisher}><FontAwesomeIcon icon={faPenNib} /> By {blog.author.displayName}</p>
            <p className={styles.date}><FontAwesomeIcon icon={faCalendarAlt} /> Posted on {createdAtDate}</p>
            <p className={styles.stats}><FontAwesomeIcon icon={faEye} /> {blog.views} views • {blog.replies} replies</p>
            <button className={styles.readMore} onClick={handleReadMore}>Read More</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard