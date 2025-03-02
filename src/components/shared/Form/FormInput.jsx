import React, { useState, useEffect } from "react";
import styles from "./FormInput.module.css"; 

const FormInput = ({ value, setValue, label, type, placeholder, isRequired, helperText, validate }) => {
    const [errorText, setErrorText] = useState("");
    const [isTouched, setIsTouched] = useState(false); // Track if input was interacted with

    // 🔹 Handle input change (real-time validation)
    const handleValueChange = (event) => {
        const newValue = event.target.value;
        setValue(newValue);

        // Validate as user types
        if (validate && isTouched) {
            setErrorText(validate(newValue));
        }
    };

    // 🔹 Handle input blur (triggers validation immediately)
    const handleBlur = () => {
        setIsTouched(true); // Mark input as touched

        // Run validation immediately after blur
        if (validate) {
            setErrorText(validate(value));
        }
    };

    const inputClassName = `${styles.input} ${isTouched && errorText ? styles["input-invalid"] : isTouched ? styles["input-valid"] : ""}`;
    console.log(inputClassName)
    return (
        <div className={styles.field}>
            <input
                value={value}
                type={type}
                placeholder={placeholder}
                required={isRequired}
                onChange={handleValueChange}
                onBlur={handleBlur} 
                className={inputClassName}

            />
            <label className={styles.label}>{label}</label>
            {helperText && !errorText && <span className={styles.helper}>{helperText}</span>}
            {errorText && <span className={styles.error}>{errorText}</span>}
        </div>
    );
};

export default FormInput;
