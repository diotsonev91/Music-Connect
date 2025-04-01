import React, { useState } from "react";
import styles from "./HelpCenter.module.css"; // Create a simple CSS module

const faqs = [
  {
    question: "How do I upload a new song?",
    answer: "Click on '+ Add New Track' from your profile or the music section."
  },
  {
    question: "How can I write a blog?",
    answer: "Go to your profile > My Blogs > '+ Add New Blog'."
  },
  {
    question: "Why can't I see other users' songs?",
    answer: "Make sure the user's profile is public or you're logged in."
  },
  {
    question: "How do I delete my account?",
    answer: "Go to your profile and click on 'Delete Account' in the Edit section."
  },
  {
    question: "How do I chat with other users?",
    answer: "Click the chat icon on a user's profile to start a conversation."
  }
];

const HelpCenter = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleAccordion = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };
  
  return (
    <div className={styles.wrapperHelp}>
      <div className={styles.helpCenter}>
      <h2>🎧 Help Center</h2>
      <p className={styles.intro}>Need help using the app? Here are some quick answers:</p>

      <div className={styles.faqList}>
        {faqs.map((faq, i) => (
          <div key={i} className={styles.faqItem}>
            <div className={styles.question} onClick={() => toggleAccordion(i)}>
              {faq.question}
              <span>{expandedIndex === i ? "▲" : "▼"}</span>
            </div>
            {expandedIndex === i && <div className={styles.answer}>{faq.answer}</div>}
          </div>
        ))}
      </div>

      <div className={styles.contactBox}>
        <p>Still need help?</p>
        <button
          className={styles.contactBtn}
          onClick={() => alert("Redirect to contact or open support chat")}
        >
          Contact Support
        </button>
      </div>
    </div>
    </div>

  );
};

export default HelpCenter;
