import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EventCard from "./EventCard";
import BlogCard from "./BlogCard";
import styles from "./BlogsPage.module.css";
import useBlogMutation from "../../hooks/useBlogMutation";

const BlogsPage = () => {
  const { category } = useParams(); // Get category from URL
  const { getAllBlogPosts, isLoading, error,fetchBlogViews, fetchBlogComments } = useBlogMutation();
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 8;
  const [sortBy, setSortBy] = useState("title");

  // ✅ Fetch blogs only when the component mounts
  useEffect(() => {
    const fetchBlogs = async () => {
      const blogData = await getAllBlogPosts();
  
      if (blogData && blogData.length > 0) {
        // Fetch views and comments count for each blog in parallel
        const blogsWithCounts = await Promise.all(
          blogData.map(async (blog) => {
            const views = await fetchBlogViews(blog.id);
            const comments = await fetchBlogComments(blog.id);
            return {
              ...blog,
              views: views || 0,
              replies: comments.length || 0,
            };
          })
        );
        setBlogs(blogsWithCounts);
      }
    };
  
    fetchBlogs();
  }, []);
  // ✅ No dependencies → Runs only on mount

  // Filter blogs by category
  const filteredBlogs = blogs.filter((blog) => blog.category === category);

  // Sorting logic
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "start_date") return (a.date || a.datePosted).localeCompare(b.date || b.datePosted);
    if (sortBy === "most_viewed") return b.views - a.views;
    if (sortBy === "most_replies") return b.replies - a.replies;
    return 0;
  });

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = sortedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(sortedBlogs.length / blogsPerPage);

  return (
    <div className={styles.blogsContainer}>
      <h2 className={styles.pageTitle}>{category.replace("_", " ").toUpperCase()} Blogs</h2>
      <div className={styles.sortContainer}>
        <label>Sort By:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="title">Title</option>
          <option value="start_date">Start Date</option>
          <option value="most_viewed">Most Viewed</option>
          <option value="most_replies">Most Replies</option>
        </select>
      </div>
      {isLoading ? (
        <p>Loading blogs...</p>
      ) : error ? (
        <p className={styles.error}>Error: {error.message}</p>
      ) : currentBlogs.length === 0 ? (
        <p className={styles.noBlogs}>No blogs available for this category.</p>
      ) : ( 
        <div className={styles.blogList}>
          {currentBlogs.map((blog) =>
            blog.category === "events" ? (
              <EventCard key={blog.id} event={blog} />
            ) : (
              <BlogCard key={blog.id} blog={blog} />
            )
          )}
        </div>
      )}
      <div className={styles.pagination}>
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogsPage;
