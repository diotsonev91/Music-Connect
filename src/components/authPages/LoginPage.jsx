import React from "react";
import FormBox from "../shared/FormBox";
import { useAuth } from "../../contexts/AuthContext"; 

export default function LoginPage() {
  const { login } = useAuth();

  const handleLogin = async ({ email, password }) => {
    const result = await login(email, password);

    if (result.success) {
      alert(`Login Successful! Welcome, ${result.user.email}`);
    } else {
      alert("Login Failed: " + result.error);
    }
  };

  return (
    <>
      <FormBox formType="login" onSubmit={handleLogin} />
    </>
  );
}
