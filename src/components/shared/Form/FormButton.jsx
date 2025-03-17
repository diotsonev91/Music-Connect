import styles from "./FormButton.module.css";

export default function FormButton({ buttonText, isFormValid, isLoading }) {
  return (
      <button 
          type="submit" 
          className={`${styles.buttonPrimary} 
                      ${!isFormValid || isLoading ? styles.disabled : ""}`} 
          disabled={!isFormValid || isLoading}
      >
          {isLoading ? "Processing..." : buttonText}
      </button>
  );
}
 