import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import BlogCard from "./BlogCard";
import styles from "./BlogsPage.module.css";

const BlogsPage = () => {
  const { category } = useParams(); // Get category from URL
  const navigate = useNavigate();

  // Dummy blog data
  const blogs = [
    { id: 1, category: "events",location: "Sofia", title: "Piano and Violin Concert", date: "2025-03-20", price: "$50", views: 300, replies: 10, image: "" },
    { id: 2, category: "events",location: "Sofia",title: "Rock Band Festival", date: "2025-04-15", price: "Free", views: 500, replies: 20, image: "" },
    { id: 3, category: "news", title: "New Music Streaming Platform Launched", views: 1200, replies: 15, avatar: "", image: "/male.jpg", publisher: "John Doe", datePosted: "2025-03-05" },
    { id: 4, category: "musicians", title: "Meet Sarah - Rising Pop Star", views: 800, replies: 8, avatar: "",  image: "/female.jpg", publisher: "Jane Smith", datePosted: "2025-03-03" },
    { id: 5, category: "search_band", title: "Looking for a Drummer in NYC", views: 600, replies: 10, avatar: "",  image: "", avatar: "", publisher: "Mike Johnson", datePosted: "2025-03-02" },
    { id: 6, category: "musicians", title: "Meet Arah - Rising Pop Star", views: 800, replies: 8, avatar: "",  image: "/female.jpg", publisher: "Jane Smith", datePosted: "2025-03-03" },
    { id: 7, category: "news", title: "New Music Streaming Platform Launched", views: 1200, replies: 15, avatar: "", image: "/male.jpg", publisher: "John Doe", datePosted: "2025-03-05" },
    { id: 8, category: "news", title: "New Music Streaming Platform Launched", views: 1200, replies: 15, avatar: "", image: "/male.jpg", publisher: "John Doe", datePosted: "2025-03-05" },
    { id: 9, category: "news", title: "New Music Streaming Platform Launched", views: 1200, replies: 15, avatar: "", image: "/male.jpg", publisher: "John Doe", datePosted: "2025-03-05" },
    { id: 10, category: "news", title: "New Music Streaming Platform Launched", views: 1200, replies: 15, avatar: "", image: "/male.jpg", publisher: "John Doe", datePosted: "2025-03-05" },
    { id: 11, category: "news", title: "New Music Streaming Platform Launched", views: 1200, replies: 15, avatar: "", image: "/male.jpg", publisher: "John Doe", datePosted: "2025-03-05" },

    { id: 12, category: "news", title: "New Music Streaming Platform Launched", views: 1200, replies: 15, avatar: "", image: "/male.jpg", publisher: "John Doe", datePosted: "2025-03-05" },

];

  const filteredBlogs = blogs.filter((blog) => blog.category === category);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 12;
  const [sortBy, setSortBy] = useState("title");

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "start_date") return (a.date || a.datePosted).localeCompare(b.date || b.datePosted);
    if (sortBy === "most_viewed") return b.views - a.views;
    if (sortBy === "most_replies") return b.replies - a.replies;
    return 0;
  });

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = sortedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(sortedBlogs.length / blogsPerPage);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

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
      {currentBlogs.length === 0 ? (
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
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default BlogsPage;
