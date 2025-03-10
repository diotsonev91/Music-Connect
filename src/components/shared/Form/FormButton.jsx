import styles from "./FormButton.module.css"

export default function FormButton({ buttonText, isFormValid }) {
  return (
      <button 
          type="submit" 
          className={`${styles.buttonPrimary} ${!isFormValid ? styles.disabled : ''}`}
          disabled={!isFormValid} 
      >
          {buttonText}
      </button>
  );
}
