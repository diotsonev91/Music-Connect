import React from "react";
import FormBox from "../shared/Form/FormBox";
import { useAuth } from "../../contexts/AuthContext";
import useMutation from "../../hooks/useMutation";
import styles from "./LoginPage.module.css"
export default function LoginPage() {
  const { login } = useAuth();
  const { mutate, isLoading, error } = useMutation(login);

  const handleLogin = async ({ email, password }) => {
    await mutate(email, password);
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.loginText}>LOGIN TO CONNECT</p>
      <FormBox formType="login" onSubmit={handleLogin} isLoading={isLoading} error={error} />
    </div>
  );
}
