import { useState } from "react";
import useMutation from "./useMutation";
import { uploadFile, deleteFile } from "../services/firebaseStorage";
import { addDocument, updateDocument, fetchDocument, fetchCollection, deleteDocument , setDocument } from "../services/firebaseFirestore";

import { db } from "../services/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";


export default function useBlogMutation() {
  const { mutate: upload, isLoading: isUploading, error: uploadError } = useMutation(uploadFile);
  const { mutate: deleteImg, isLoading: isDeletingImage, error: deleteImgError } = useMutation(deleteFile);
  const { mutate: saveBlog, isLoading: isSaving, error: saveError } = useMutation((data) => addDocument("blogs", data));
  const { mutate: updateBlog, isLoading: isUpdating, error: updateError } = useMutation((data) => updateDocument("blogs", data.id, data));
  const { mutate: fetchBlog, isLoading: isFetching, error: fetchError } = useMutation((id) => fetchDocument("blogs", id));
  const { mutate: fetchBlogs, isLoading: isFetchingAll, error: fetchAllError } = useMutation(() => fetchCollection("blogs"));
  const { mutate: deleteBlog, isLoading: isDeleting, error: deleteBlogError } = useMutation((id) => deleteDocument("blogs", id));
  const { mutate: getBlogViews, isLoading: isLoadingViews, error: viewsError } = useMutation(async (blogId) => {
    const viewsPath = `blogs/${blogId}/views`;
    const views = await fetchCollection(viewsPath);
    return views.length;
  });
  
  const { mutate: getBlogComments, isLoading: isLoadingComments, error: commentsError } = useMutation(async (blogId) => {
    const commentsRef = collection(db, "blogs", blogId, "comments");
    const snapshot = await getDocs(commentsRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  });

  const [message, setMessage] = useState("");

  const isLoading =
  isUploading ||
  isSaving ||
  isUpdating ||
  isFetching ||
  isFetchingAll ||
  isDeleting ||
  isDeletingImage ||
  isLoadingViews ||
  isLoadingComments;

  const error =
  uploadError ||
  saveError ||
  updateError ||
  fetchError ||
  fetchAllError ||
  deleteBlogError ||
  deleteImgError ||
  viewsError ||
  commentsError;

  // ✅ Function to create or update a blog post
  const saveOrUpdateBlog = async (formData, user, blogId = null) => {
    if (!user) {
      setMessage("User not logged in.");
      return { success: false, error: "User not logged in." };
    }
  
    try {
      let imageUrl = formData.imageUrl;
  
      if (formData.image instanceof File) {
        imageUrl = await upload(formData.image, "blog_images", formData.imageUrl);
      }
  
      const blogData = {
        title: formData.title,
        category: formData.category,
        content: formData.content,
        imageUrl,
        author: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Anonymous",
          avatar: user?.photoURL
        },
        createdAt: new Date(),
      };
  
      // ✅ Add event-specific data if applicable
      if (formData.category === "events") {
        blogData.price = formData.price || "";
        blogData.date = formData.date || "";
        blogData.location = formData.location || "";
      }
  
      let newId;
  
      if (blogId) {
        await updateBlog({ id: blogId, ...blogData });
        setMessage("Blog post updated successfully!");
        newId = blogId;
      } else {
        const savedBlogId = await saveBlog(blogData);
        console.log("SAVED BLOG:  ", savedBlogId);
        setMessage("Blog post created successfully!");
        newId = savedBlogId || null;
      }
  
      return { success: true, id: newId };
    } catch (error) {
      setMessage("Error: " + error.message);
      return { success: false, error: error.message };
    }
  };
  
  
  const trackUserView = async (blogId, userId) => {
    try {
      const viewPath = `blogs/${blogId}/views`;
      const viewDoc = await fetchDocument(viewPath, userId);  // still use fetchDocument to check
  
      if (!viewDoc) {
        // ✅ Guarantees the document is created/overwritten with userId as the document ID
        await setDocument(viewPath, userId, { viewedAt: new Date() });
      }
    } catch (error) {
      setMessage("Error tracking blog view: " + error.message);
    }
  };

  const fetchBlogViews = async (blogId) => {
    try {
      return await getBlogViews(blogId);
    } catch (error) {
      setMessage("Error fetching blog views: " + error.message);
      return 0;
    }
  };
  
  const fetchBlogComments = async (blogId) => {
    try {
      return await getBlogComments(blogId);
    } catch (error) {
      setMessage("Error fetching blog comments: " + error.message);
      return [];
    }
  };
  

  // ✅ Function to fetch a single blog post
  const getBlog = async (blogId) => {
    try {
      return await fetchBlog(blogId);
    } catch (error) {
      setMessage("Error fetching blog post: " + error.message);
      return null;
    }
  };

  // ✅ Function to fetch all blog posts
  const getAllBlogPosts = async () => {
    try {
      return await fetchBlogs();
    } catch (error) {
      setMessage("Error fetching blog posts: " + error.message);
      return [];
    }
  };

  // ✅ Function to delete a blog post and its associated image
  const deleteBlogPost = async (blogId, imageUrl) => {
    try {
      if (imageUrl) await deleteImg(imageUrl); // ✅ Delete blog image from Firebase Storage
      await deleteBlog(blogId); // ✅ Delete blog document from Firestore
      setMessage("Blog post deleted successfully!");
      return { success: true };
    } catch (error) {
      setMessage("Error deleting blog post: " + error.message);
      return { success: false, error: error.message };
    }
  };



  const postCommentToBlog = async (blogId, commentData) => {
    try {
      const path = `blogs/${blogId}/comments`;
      const newCommentId = await addDocument(path, {
        ...commentData,
        createdAt: new Date(),
      });
      setMessage("Comment added successfully!");
      return { success: true , id: newCommentId };
    } catch (error) {
      setMessage("Error adding comment: " + error.message);
      return { success: false, error: error.message };
    }
  };

  // ✅ Edit a comment using your generic updateDocument
  const editCommentOfBlog = async (blogId, commentId, updatedCommentData) => {
    if (!commentId) {
      return { success: false, error: "Comment ID is missing" };
    }
    try {
      const path = `blogs/${blogId}/comments`;
      await updateDocument(path, commentId, {
        ...updatedCommentData,
        updatedAt: new Date(),
      });
      setMessage("Comment updated successfully!");
      return { success: true };
    } catch (error) {
      setMessage("Error updating comment: " + error.message);
      return { success: false, error: error.message };
    }
  };

  const getUserBlogs = async (userId) => {
    try {
      const q = query(collection(db, "blogs"), where("author.uid", "==", userId));
      const snapshot = await getDocs(q);
      const userBlogs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return userBlogs;
    } catch (error) {
      setMessage("Error fetching user's blogs: " + error.message);
      return [];
    }
  };


  const deleteCommentOfBlog = async (blogId, commentId) => {
    try {
      const path = `blogs/${blogId}/comments`;
      await deleteDocument(path, commentId);
      setMessage("Comment deleted successfully!");
      return { success: true };
    } catch (error) {
      setMessage("Error deleting comment: " + error.message);
      return { success: false, error: error.message };
    }
  };

  const deleteAllBlogsOfUser = async (userId) => {
    try {
      const blogs = await getUserBlogs(userId);
      
      for (const blog of blogs) {
        const imageUrl = blog.imageUrl || null;
        await deleteBlogPost(blog.id, imageUrl);
      }
  
      setMessage("All blog posts deleted successfully!");
      return { success: true };
    } catch (error) {
      setMessage("Error deleting all user blogs: " + error.message);
      return { success: false, error: error.message };
    }
  };
  
  return {
    saveOrUpdateBlog,
    getBlog: fetchBlog,
    getAllBlogPosts: fetchBlogs,
    deleteBlogPost: deleteBlogPost,
    getUserBlogs,
    deleteCommentOfBlog,
    fetchBlogComments, 
    postCommentToBlog,   
    trackUserView,        
    fetchBlogViews,
    editCommentOfBlog,
    deleteAllBlogsOfUser,
    isLoading,
    error,
    message,
  };
}
