import React from "react";
import BlogForm from "./BlogForm";

const PostBlog = () => {
  return (
    <div>
      <BlogForm onSubmitSuccess={() => alert("Blog Created!")} />
    </div>
  );
};

export default PostBlog;
