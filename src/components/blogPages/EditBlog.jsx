import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import BlogForm from "./BlogForm";
import { useParams } from "react-router-dom";

const EditBlog = () => {
  const { id } = useParams();
  const [blogData, setBlogData] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(db, "blogs", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBlogData({ id, ...docSnap.data() });
      }
    };

    fetchBlog();
  }, [id]);

  return (
    <div>
      {blogData ? <BlogForm existingBlog={blogData} onSubmitSuccess={() => alert("Blog Updated!")} /> : <p>Loading...</p>}
    </div>
  );
};

export default EditBlog;
