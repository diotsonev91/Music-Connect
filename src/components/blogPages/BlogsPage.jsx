import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import BlogCard from "./BlogCard";
import styles from "./BlogsPage.module.css";

const BlogsPage = () => {
  const { category } = useParams(); // Get category from URL
  const navigate = useNavigate();

    //TEST DUMMY 
    const blogContent = `What is Lorem Ipsum?
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Why do we use it?
It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).


Where does it come from?
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. 
The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.

Where can I get some?
There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.`

  // Dummy blog data
  const blogs = [
    { id: 1, category: "events", content: blogContent, location: "Sofia", title: "Piano and Violin Concert", date: "2025-03-20", price: "$50", views: 300, replies: 10, image: "" },
    { id: 2, category: "events",content: blogContent, location: "Sofia",title: "Rock Band Festival", date: "2025-04-15", price: "Free", views: 500, replies: 20, image: "" },
    { id: 3, category: "news", content: blogContent,  title: "New Music Streaming Platform Launched", views: 1200, replies: 15, avatar: "", image: "/male.jpg", publisher: "John Doe", datePosted: "2025-03-05" },
    { id: 4, category: "musicians",content: blogContent, title: "Meet Sarah - Rising Pop Star", views: 800, replies: 8, avatar: "",  image: "/female.jpg", publisher: "Jane Smith", datePosted: "2025-03-03" },
    { id: 5, category: "search_band", content: blogContent, title: "Looking for a Drummer in NYC", views: 600, replies: 10, avatar: "",  image: "", avatar: "", publisher: "Mike Johnson", datePosted: "2025-03-02" },
    { id: 6, category: "musicians", content: blogContent, title: "Meet Arah - Rising Pop Star", views: 800, replies: 8, avatar: "",  image: "/female.jpg", publisher: "Jane Smith", datePosted: "2025-03-03" },
    { id: 7, category: "news", content: blogContent, title: "New Music Streaming Platform Launched", views: 1200, replies: 15, avatar: "", image: "/male.jpg", publisher: "John Doe", datePosted: "2025-03-05" },
    { id: 8, category: "news", content: blogContent, title: "New Music Streaming Platform Launched", views: 1200, replies: 15, avatar: "", image: "/male.jpg", publisher: "John Doe", datePosted: "2025-03-05" },
    { id: 9, category: "news", content: blogContent, title: "New Music Streaming Platform Launched", views: 1200, replies: 15, avatar: "", image: "/male.jpg", publisher: "John Doe", datePosted: "2025-03-05" },
    { id: 10, category: "news", content: blogContent, title: "New Music Streaming Platform Launched", views: 1200, replies: 15, avatar: "", image: "/male.jpg", publisher: "John Doe", datePosted: "2025-03-05" },
    { id: 11, category: "news", content: blogContent, title: "New Music Streaming Platform Launched", views: 1200, replies: 15, avatar: "", image: "/male.jpg", publisher: "John Doe", datePosted: "2025-03-05" },

    { id: 12, category: "news", content: blogContent, title: "New Music Streaming Platform Launched", views: 1200, replies: 15, avatar: "", image: "/male.jpg", publisher: "John Doe", datePosted: "2025-03-05" },

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
