import React from "react";
import FormBox from "../shared/components/FormBox";

export default function LoginPage() {
    
    const handleLogin = async ({ email, password }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            alert(`Login Successful! Welcome, ${user.email}`);
            console.log("Logged in user:", user);
        } catch (error) {
            console.error("Login Error:", error.message);
            alert("Login Failed: " + error.message);
        }
    };

    return (
        <>
            <h2>Login to connect</h2>
            <FormBox formType="login" onSubmit={handleLogin} />
        </>
    );
}
