import React from "react";
import FormBox from "../shared/components/FormBox";
import { auth, db } from "../firebaseConfig";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 

export default function RegisterPage() {
    
    const handleRegister = async ({ email, password }) => {
        try {
            if (!email || !password) {
                alert("Email and Password are required!");
                return;
            }

          
            const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
            const user = userCredential.user;

            
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: new Date(),
            });

            alert(`Registration Successful! Welcome, ${user.email}`);
            console.log("Registered user:", user);
        } catch (error) {
            console.error("Registration Error:", error.message);
            alert("Registration Failed: " + error.message);
        }
    };

    return (
        <>
            <h2>Register to get started</h2>
            <FormBox formType="register" onSubmit={handleRegister} />
        </>
    );
}
