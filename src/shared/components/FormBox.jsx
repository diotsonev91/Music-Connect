import React, { useState, useEffect } from "react";
import styles from "./FormBox.module.css";
import FormInput from "./FormInput";
import FormButton from "./FormButton";

export default function FormBox({ formType, onSubmit }) {
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

    //TODO see ho to fix when typing first  the confirm password and then the password
    const validateConfirmPassword = (confirmPassword) => {
        if (confirmPassword.length < 6){ 
          return "Password must be at least 6 characters"
        }
         
        if (formType === "register" && confirmPassword !== password) return "Passwords do not match";
        return "";
    };

   
    useEffect(() => {
        setErrors({
            email: validateEmail(email),
            password: validatePassword(password),
            confirmPassword: validateConfirmPassword(confirmPassword),
        });
    }, [email, password, confirmPassword, formType]);

    
    useEffect(() => {
        setIsFormValid(
            !errors.email && !errors.password && (!errors.confirmPassword || formType !== "register")
        );
    }, [errors, email, password, confirmPassword, formType]);

 
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
                    helperText="Minimum 6 characters and maximum 12 characters"
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

                <FormButton buttonText={formType === "register" ? "Sign Up" : "Login"} isFormValid={isFormValid} />
            </form>
        </div>
    );
}
