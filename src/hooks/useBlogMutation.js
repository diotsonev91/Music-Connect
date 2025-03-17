import { useState } from "react";
import useMutation from "./useMutation";
import { uploadFile, deleteFile } from "../services/firebaseStorage";
import { addDocument, updateDocument, fetchDocument, fetchCollection, deleteDocument } from "../services/firebaseFirestore";

export default function useBlogMutation() {
  const { mutate: upload, isLoading: isUploading, error: uploadError } = useMutation(uploadFile);
  const { mutate: deleteImg, isLoading: isDeletingImage, error: deleteImgError } = useMutation(deleteFile);
  const { mutate: saveBlog, isLoading: isSaving, error: saveError } = useMutation((data) => addDocument("blogs", data));
  const { mutate: updateBlog, isLoading: isUpdating, error: updateError } = useMutation((data) => updateDocument("blogs", data.id, data));
  const { mutate: fetchBlog, isLoading: isFetching, error: fetchError } = useMutation((id) => fetchDocument("blogs", id));
  const { mutate: fetchBlogs, isLoading: isFetchingAll, error: fetchAllError } = useMutation(() => fetchCollection("blogs"));
  const { mutate: deleteBlog, isLoading: isDeleting, error: deleteBlogError } = useMutation((id) => deleteDocument("blogs", id));

  const [message, setMessage] = useState("");

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
        },
        createdAt: new Date(),
      };

      if (blogId) {
        await updateBlog({ id: blogId, ...blogData });
        setMessage("Blog post updated successfully!");
      } else {
        await saveBlog(blogData);
        setMessage("Blog post created successfully!");
      }

      return { success: true };
    } catch (error) {
      setMessage("Error: " + error.message);
      return { success: false, error: error.message };
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

  const isLoading = isUploading || isSaving || isUpdating || isFetching || isFetchingAll || isDeleting || isDeletingImage;

  return {
    saveOrUpdateBlog,
    getBlog: fetchBlog,
    getAllBlogPosts: fetchBlogs,
    deleteBlogPost: deleteBlog,
    isLoading,
    error: uploadError || saveError || updateError || fetchError || fetchAllError || deleteBlogError || deleteImgError,
    message,
  };
}
