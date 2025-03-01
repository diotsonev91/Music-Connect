import React from "react";
import FormBox from "../shared/FormBox";
import { useAuth } from "../../contexts/AuthContext"; 

export default function RegisterPage() {
  const { register } = useAuth();

  const handleRegister = async ({ email, password }) => {
    const result = await register(email, password);

    if (result.success) {
      alert(`Registration Successful! Welcome, ${result.user.email}`);
    } else {
      alert("Registration Failed: " + result.error);
    }
  };

  return (
    <>
      <FormBox formType="register" onSubmit={handleRegister} />
    </>
  );
}
