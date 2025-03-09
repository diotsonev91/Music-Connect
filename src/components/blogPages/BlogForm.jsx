import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../../firebaseConfig";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import styles from "./BlogForm.module.css";
import FileUploadButton from "../shared/App/FileUploadButton";
import FormInput from "../shared/Form/FormInput"; // ✅ Import reusable input

const sections = [
  { title: "Upcoming Events", category: "events" },
  { title: "Latest News", category: "news" },
  { title: "Meet the Musicians", category: "musicians" },
  { title: "Find a Band", category: "search_band" }
];

const BlogForm = ({ existingBlog = null, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "events",
    content: "",
    image: null,
    imageUrl: "",
  });

  const [errors, setErrors] = useState({ title: "", content: "" });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (existingBlog) {
      setFormData({
        title: existingBlog.title,
        category: existingBlog.category,
        content: existingBlog.content,
        imageUrl: existingBlog.imageUrl || "",
        image: null,
      });
    }
  }, [existingBlog]);

  // 🔹 Update formData while keeping it controlled
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Validation functions
  const validateTitle = (value) => {
    if (value.length < 4) return "Title must be at least 4 characters.";
    if (value.length > 20) return "Title must be at most 20 characters.";
    return "";
  };

  const validateContent = (value) => {
    if (value.length < 20) return "Content must be at least 20 characters.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const titleError = validateTitle(formData.title);
    const contentError = validateContent(formData.content);

    if (titleError || contentError) {
      setErrors({ title: titleError, content: contentError });
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const user = auth.currentUser;
      if (!user) {
        setMessage("User not logged in.");
        setLoading(false);
        return;
      }

      const imageUrl = formData.image ? await uploadImage() : formData.imageUrl;

      if (existingBlog) {
        await updateDoc(doc(db, "blogs", existingBlog.id), {
          title: formData.title,
          category: formData.category,
          content: formData.content,
          imageUrl,
          updatedAt: serverTimestamp(),
        });

        setMessage("Blog updated successfully!");
      } else {
        await addDoc(collection(db, "blogs"), {
          title: formData.title,
          category: formData.category,
          content: formData.content,
          imageUrl,
          author: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "Anonymous",
          },
          createdAt: serverTimestamp(),
        });

        setMessage("Blog post created successfully!");
      }

      setUploadProgress(0);
      setFormData({ title: "", category: "events", content: "", imageUrl: "", image: null });
      onSubmitSuccess && onSubmitSuccess();
    } catch (error) {
      setMessage("Error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{existingBlog ? "Edit Blog" : "Create a Blog Post"}</h2>
      <form onSubmit={handleSubmit} className={styles.blogForm}>
      <div className={styles.row}>
      <div className={styles.field}>
     
      
        <label className={styles.label}>Title: </label>
          {/* ✅ Using Reusable FormInput */}
          <FormInput
    value={formData.title}
    setValue={(value) => handleChange("title", value)}
    label="Blog Title"
    type="text"
    
    isRequired={true}
    helperText="Title should be between 4-20 characters."
    validate={validateTitle}
    formType="blog" /* ✅ Apply blog styles */
   
 />

  </div>

 {/* Dropdown for category selection */}
 <div className={styles.field}>
    <label className={styles.label}>Select Category</label> {/* ✅ Added label for consistency */}
    <select
      className={styles.select}
      name="category"
      value={formData.category}
      onChange={(e) => handleChange("category", e.target.value)}
      required
    >
      {sections.map((section) => (
        <option key={section.category} value={section.category}>
          {section.title}
        </option>
      ))}
    </select>
  </div>
 </div>
<FormInput
    value={formData.content}
    setValue={(value) => handleChange("content", value)}
    label=""
    type="area" /* ✅ Render textarea */
    placeholder="Write your blog content here..."
    isRequired={true}
    helperText="Content should be at least 20 characters."
    validate={validateContent}
    formType="blog" /* ✅ Apply blog styles */
 />

       



        <div className={styles.row2}>
          {/* File Upload Input */}
          <FileUploadButton
            accept="image/*"
            buttonText="Upload Image"
            onFileSelect={(file) => handleChange("image", file)}
          />

          {/* Show Image Preview */}
          {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className={styles.previewImage} />}
          {uploadProgress > 0 && <p>Uploading: {Math.round(uploadProgress)}%</p>}
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Submitting..." : existingBlog ? "Update Blog" : "Create Blog"}
        </button>

        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

export default BlogForm;
