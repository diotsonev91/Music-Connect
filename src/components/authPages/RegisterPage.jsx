import React from "react";
import FormBox from "../shared/Form/FormBox";
import { useAuth } from "../../contexts/AuthContext";
import useMutation from "../../hooks/useMutation";
import styles from "./LoginPage.module.css";

export default function RegisterPage() {
  const { register } = useAuth();
  const { mutate, isLoading, error } = useMutation(register);

  const handleRegister = async ({ email, password }) => {
    await mutate(email, password); 
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.loginText}>JOIN MUSIC CONNECT</p>
      <FormBox formType="register" onSubmit={handleRegister} isLoading={isLoading} error={error} />
    </div>
  );
}
