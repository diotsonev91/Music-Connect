import React, { useState, useEffect } from "react";
import styles from "./FormBox.module.css";
import FormInput from "./FormInput";
import FormButton from "./FormButton";

export default function FormBox({ formType, onSubmit, isLoading, error }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({ email: "", password: "", confirmPassword: "" });
    const [isFormValid, setIsFormValid] = useState(false);

    const validateEmail = (email) => {
        if (!email) return "Email is required";
        if (!email.includes("@")) return "Invalid email format";
        return "";
    };

    const validatePassword = (password) => {
        if (!password) return "Password is required";
        if (password.length < 6) return "Password must be at least 6 characters";
        return "";
    };

    // ✅ Fix: Check confirm password validation correctly
    const validateConfirmPassword = (confirmPassword) => {
        if (!confirmPassword) return "Confirm Password is required";
        if (confirmPassword.length < 6) return "Password must be at least 6 characters";
        if (formType === "register" && confirmPassword !== password) return "Passwords do not match";
        return "";
    };

    // ✅ Recalculate errors when input changes
    useEffect(() => {
        setErrors({
            email: validateEmail(email),
            password: validatePassword(password),
            confirmPassword: formType === "register" ? validateConfirmPassword(confirmPassword) : "",
        });
    }, [email, password, confirmPassword, formType]);

    // ✅ Check if form is valid
    useEffect(() => {
        setIsFormValid(
            !errors.email && !errors.password && (!errors.confirmPassword || formType !== "register")
        );
    }, [errors, email, password, confirmPassword, formType]);

    // ✅ Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        if (isFormValid) {
            onSubmit({ email, password });
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <FormInput
                    value={email}
                    setValue={setEmail}
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    isRequired={true}
                    errorText={errors.email}
                    helperText="Example: john.doe@gmail.com"
                    validate={validateEmail}
                />
                <FormInput
                    value={password}
                    setValue={setPassword}
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    isRequired={true}
                    errorText={errors.password}
                    helperText="Minimum 6 characters"
                    validate={validatePassword}
                />
                {formType === "register" && (
                    <FormInput
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                        label="Confirm Password"
                        type="password"
                        placeholder="Re-enter your password"
                        isRequired={true}
                        errorText={errors.confirmPassword}
                        validate={validateConfirmPassword}
                    />
                )}

                {/* ✅ Show error message from Firebase auth */}
                {error && <p className={styles.error}>{error}</p>}

                <FormButton 
                    buttonText={formType === "register" ? "Sign Up" : "Login"} 
                    isFormValid={isFormValid} 
                    isLoading={isLoading} 
                />
            </form>
        </div>
    );
}
