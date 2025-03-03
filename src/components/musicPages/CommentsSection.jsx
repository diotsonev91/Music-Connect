import React, { useState, useEffect, useRef } from "react";
import styles from "./CommentsSection.module.css";
import { useComments } from "../../contexts/TrackCommentContext";

const CommentsSection = ({ trackId, selectedTimestamp, resetTimestamp }) => {
  const { comments, addComment } = useComments();
  const [newComment, setNewComment] = useState("");
  const inputRef = useRef(null);

  // Auto-focus input field when a timestamp is selected
  useEffect(() => {
    if (selectedTimestamp !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedTimestamp]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if(selectedTimestamp === null){
      selectedTimestamp =-1;
    }

    const currentDate = new Date().toLocaleString(); 


    addComment(trackId, selectedTimestamp, { text: newComment, date: currentDate });

    setNewComment("");
    resetTimestamp();
    console.log("SELECTED TIMESTAMP: ",timestamp)
  };

  return (
    <div className={styles.commentsContainer}>
      <h3>Comments</h3>
      <ul className={styles.commentList}>
        {(comments[trackId] || []).map((comment, index) => (
          <li key={index} className={styles.commentItem}>
            <strong className={styles.timestamp}>
            <>
  {comment.time >= 0 ? (
    <>
      <p>{comment.time.toFixed(2)}s</p> 
      {` | ${comment.date}:`}
    </>
  ) : (
    `${comment.date}:`
  )}
</>

            </strong>{" "}
            {comment.text} 
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddComment}>
        <input
          ref={inputRef}
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={
            selectedTimestamp !== null
              ? `Add comment at: ${selectedTimestamp.toFixed(2)}s`
              : "Add a comment"
          }
          className={`${styles.inputField} ${selectedTimestamp !== null ? styles.highlightPlaceholder : ""}`}
        />
        <button type="submit" className={styles.commentButton}>
          Comment
        </button>
      </form>
    </div>
  );
};

export default CommentsSection;
