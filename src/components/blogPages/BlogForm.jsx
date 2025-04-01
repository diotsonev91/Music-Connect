import React, { useState } from "react";
import styles from "./BlogForm.module.css";
import FileUploadButton from "../shared/App/FileUploadButton";
import FormInput from "../shared/Form/FormInput";
import { useEffect, useRef } from "react";

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
    category: initialData.category || "",
    content: initialData.content || "",
    imageUrl: initialData.imageUrl || "",
    image: null,
  };

  const autocompleteRef = useRef(null);


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

  const validatePrice = (value) => {
    if (!value || isNaN(value) || Number(value) <= 0) return "Price must be a positive number.";
    return "";
  };
  
  const validateDate = (value) => {
    if (!value) return "Date is required.";
    const now = new Date();
    const selected = new Date(value);
    if (selected < now) return "Date must be in the future.";
    return "";
  };
  
  const validateLocation = (value) => {
    if (!value || value.trim().length < 3) return "Location must be at least 3 characters.";
    return "";
  };

  
  // 🔹 Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const titleError = validateTitle(formData.title);
    const contentError = validateContent(formData.content);
    let additionalErrors = {};
  
    if (!formData.category) {
      additionalErrors.category = "Category is required.";
    }
  
    // Additional validation for events
    if (formData.category === "events") {
      if (!formData.price) additionalErrors.price = "Price is required.";
      if (!formData.date) additionalErrors.date = "Date is required.";
      if (!formData.location) additionalErrors.location = "Location is required.";
    }
  
    const hasErrors = titleError || contentError || Object.keys(additionalErrors).length > 0;
  
    if (hasErrors) {
      setErrors({
        title: titleError,
        content: contentError,
        ...additionalErrors,
      });
      return;
    }
  
    onSubmit(formData);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imageUrl: "", 
    }));
  };

  const isFormValid = () => {
    const titleValid = !validateTitle(formData.title);
    const contentValid = !validateContent(formData.content);
    const categoryValid = !!formData.category;
  
    let eventFieldsValid = true;
  
    if (formData.category === "events") {
      eventFieldsValid =
        !!formData.price && !!formData.date && !!formData.location;
    }
  
    return titleValid && contentValid && categoryValid && eventFieldsValid;
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
               <option value="" disabled>
                Select category
              </option>
              {sections.map((section) => (
                <option key={section.category} value={section.category}>
                  {section.title}
                </option>
              ))}
            </select>
          </div>
          
        </div>
        <hr className={styles.hrSpace}/>
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
  {formData.category === "events" && (
  <>
  <hr className={styles.hrSpace}/>
   <FormInput
  value={formData.price || ""}
  setValue={(value) => handleChange("price", value)}
  label="Event Price"
  type="number"
  placeholder="Enter event price"
  isRequired={true}
  validate={validatePrice}
  formType="blog"
/>
<hr className={styles.hrSpace}/>
<FormInput
  value={formData.date || ""}
  setValue={(value) => handleChange("date", value)}
  label="Event Date"
  type="date"
  isRequired={true}
  validate={validateDate}
  formType="blog"
/>
<hr className={styles.hrSpace}/>
<FormInput
  value={formData.location || ""}
  setValue={(value) => handleChange("location", value)}
  label="Event Location"
  type="text"
  placeholder="Enter event location"
  isRequired={true}
  validate={validateLocation}
  formType="blog"
/>
    {errors.location && <p className={styles.errorText}>{errors.location}</p>}
  </>
)}
<div className={styles.buttonsImage}>        
{formData.imageUrl && <button className={styles.deleteImageBtn} onClick={handleRemoveImage}>❌</button>}
<FileUploadButton
  accept="image/*"
  buttonText={!formData.imageUrl ? "Upload Image" : "Replace Image"}
  onFileSelect={(file) => {
    handleChange("image", file);
    
    // ✅ Generate preview URL for the selected image
    if (file) {
      const imagePreviewUrl = URL.createObjectURL(file);
      handleChange("imageUrl", imagePreviewUrl);
    }
  }}
/>
</div>
        {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className={styles.previewImage} />}

<button
  type="submit"
  className={`${styles.button} ${!isFormValid() ? styles.disabled : ""}`}
  disabled={loading || !isFormValid()}
>
  {loading
    ? "Submitting..."
    : initialData?.title
    ? "Update Blog"
    : "Create Blog"}
</button>
      </form>
    </div>
  );
};

export default BlogForm;
