import React, { useState } from "react";
import styles from "./BlogForm.module.css";
import FileUploadButton from "../shared/App/FileUploadButton";
import FormInput from "../shared/Form/FormInput";

const sections = [
  { title: "Upcoming Events", category: "events" },
  { title: "Latest News", category: "news" },
  { title: "Meet the Musicians", category: "musicians" },
  { title: "Find a Band", category: "search_band" }
];

const BlogForm = ({ initialData = {}, onSubmit, loading }) => {
  // ✅ Store initial values separately (No useEffect needed)
  const defaultFormData = {
    title: initialData.title || "",
    category: initialData.category || "events",
    content: initialData.content || "",
    imageUrl: initialData.imageUrl || "",
    image: null,
  };

  // ✅ State manages user input (No need for listening to `initialData`)
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState({ title: "", content: "" });

  // 🔹 Handle input changes
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Validation functions
  const validateTitle = (value) => {
    if (value.length < 4) return "Title must be at least 4 characters.";
    if (value.length > 50) return "Title must be at most 50 characters.";
    return "";
  };

  const validateContent = (value) => {
    if (value.length < 30) return "Content must be at least 30 characters.";
    return "";
  };

  // 🔹 Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const titleError = validateTitle(formData.title);
    const contentError = validateContent(formData.content);

    if (titleError || contentError) {
      setErrors({ title: titleError, content: contentError });
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>
        {initialData?.title ? "Edit Blog" : "Create a Blog Post"}
      </h2>
      <form onSubmit={handleSubmit} className={styles.blogForm}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Title: </label>
            <FormInput
              value={formData.title}
              setValue={(value) => handleChange("title", value)}
              label="Blog Title"
              type="text"
              isRequired={true}
              helperText="Title should be between 4-20 characters."
              validate={validateTitle}
              formType="blog"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Select Category</label>
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
          type="area"
          placeholder="Write your blog content here..."
          isRequired={true}
          helperText="Content should be at least 20 characters."
          validate={validateContent}
          formType="blog"
        />

<FileUploadButton
  accept="image/*"
  buttonText="Upload Image"
  onFileSelect={(file) => {
    handleChange("image", file);
    
    // ✅ Generate preview URL for the selected image
    if (file) {
      const imagePreviewUrl = URL.createObjectURL(file);
      handleChange("imageUrl", imagePreviewUrl);
    }
  }}
/>
        {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className={styles.previewImage} />}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Submitting..." : initialData?.title ? "Update Blog" : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
