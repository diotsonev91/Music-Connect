import React, { useState, useEffect } from "react";
import styles from "./FormBox.module.css";
import FormInput from "./FormInput";
import FormButton from "./FormButton";

export default function FormBox({initialCreds={}, formType, onSubmit, isLoading, error }) {
    const [email, setEmail] = useState(initialCreds.email || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [errors, setErrors] = useState({ email: "", password: "", confirmPassword: "" });
    const [isFormValid, setIsFormValid] = useState(false);

    const validateEmail = (email) => {
        if (!email) return "Email is required";
      
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      
        if (!emailRegex.test(email)) return "Invalid email format";
      
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
        if ((formType === "register" || formType === "edit") && confirmPassword !== password) return "Passwords do not match";
        return "";
    };

    const validateCurrentPassword = (currentPassword) => {
        if (formType === "edit" && !currentPassword) return "Current password is required";
        return "";
    };
    // ✅ Recalculate errors when input changes
    useEffect(() => {
        setErrors({
            email: validateEmail(email),
            password: validatePassword(password),
            confirmPassword:(formType === "register" || formType === "edit") ? validateConfirmPassword(confirmPassword) : "",
            currentPassword:
            formType === "edit" ? validateCurrentPassword(currentPassword) : "",
    });
}, [email, password, confirmPassword, currentPassword, formType]);

    // ✅ Check if form is valid
    useEffect(() => {
        setIsFormValid(
            !errors.email && !errors.password && ((!errors.confirmPassword && !errors.currentPassword ) || (formType !== "register" && formType !== "edit"))
        );
    }, [errors, email, password, confirmPassword,currentPassword, formType]);


   
    // ✅ Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        if (isFormValid) {
            const data = { email, password };
            if (formType === "edit") {
                data.currentPassword = currentPassword;
            }
            onSubmit(data);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} >
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
                    placeholder= { formType === "edit" ? "Enter your new password" : "Enter your password" }
                    isRequired={true}
                    errorText={errors.password}
                    helperText="Minimum 6 characters"
                    validate={validatePassword}
                />



                {(formType === "register" || formType==="edit") && (
                    <FormInput
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                        label="Confirm Password"
                        type="password"
                        placeholder={ formType === "edit" ? "Re-enter your new password"  :"Re-enter your password"}
                        isRequired={true}
                        errorText={errors.confirmPassword}
                        validate={validateConfirmPassword}
                    />
                )}

                {formType === "edit" && (
                    <FormInput
                        value={currentPassword}
                        setValue={setCurrentPassword}
                        label="Current Password"
                        type="password"
                        placeholder="Enter your current password"
                        isRequired={true}
                        errorText={errors.currentPassword}
                        helperText="Required to confirm changes"
                        validate={validateCurrentPassword}
                    />
                )}

                {/* ✅ Show error message from Firebase auth */}
                {error && <p className={styles.error}>{error}</p>}

                    <FormButton 
                    buttonText={
                        formType === "register"
                        ? "Sign Up"
                        : formType === "edit"
                        ? "Edit Profile Credentials"
                        : "Login"
                    }
                    isFormValid={isFormValid} 
                    isLoading={isLoading} 
                    />
            </form>
        </div>
    );
}
