import React, { useState, useEffect } from "react";
import styles from "./FormInput.module.css"; 

const FormInput = ({ 
    value, 
    setValue, 
    label, 
    type = "text", 
    placeholder, 
    isRequired, 
    helperText, 
    validate, 
    formType // ✅ New: Form type (e.g., "blog")
}) => {
    const [errorText, setErrorText] = useState("");
    const [isTouched, setIsTouched] = useState(false);

    // 🔹 Handle input change
    const handleValueChange = (event) => {
        const newValue = event.target.value;
        setValue(newValue);

        if (validate && isTouched) {
            setErrorText(validate(newValue));
        }
    };

    // 🔹 Handle input blur (triggers validation)
    const handleBlur = () => {
        setIsTouched(true);
        if (validate) {
            setErrorText(validate(value));
        }
    };

    const inputClassName = [
        styles.input,
        isTouched && errorText ? styles["input-invalid"] : "",
        isTouched && !errorText ? styles["input-valid"] : "",
        formType === "blog" ? styles.blogInput : "",
    ].filter(Boolean).join(" ");
    return (
        <div className={`${styles.field} ${isTouched ? styles.touched : ""} ${formType !=="blog" ? styles.fieldDefault : styles.fieldBlog }`}>
            {type === "area" ? (
                // ✅ Render <textarea> when type is "area"
                <textarea
                    value={value}
                    placeholder={placeholder}
                    required={isRequired}
                    onChange={handleValueChange}
                    onBlur={handleBlur}
                    className={`${inputClassName} ${formType === "blog" ? styles.blogFormTextarea : ""}`}
                />
            ) : (
                // ✅ Render <input> otherwise
                <input
                    value={value}
                    type={type}
                    placeholder={placeholder}
                    required={isRequired}
                    onChange={handleValueChange}
                    onBlur={handleBlur}
                    className={inputClassName}
                />
            )}

            {errorText && <label className={styles.label}>{label}</label>}
            {helperText && !errorText && <span className={styles.helper}>{helperText}</span>}
            {errorText && <span className={styles.error}>{errorText}</span>}
        </div>
    );
};

export default FormInput;
