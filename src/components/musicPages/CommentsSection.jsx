import React, { useState, useEffect, useRef } from "react";
import styles from "./CommentsSection.module.css";
import { useComments } from "../../contexts/TrackCommentContext";
import { useAuth } from "../../contexts/AuthContext";
import useTrackMutation from "../../hooks/useTrackMutation";
import Modal from "../shared/App/Modal";
import ConfirmPopup from "../shared/App/ConfirmPopup";

const CommentsSection = ({ trackId, selectedTimestamp, resetTimestamp }) => {
  const { user } = useAuth();
  const { comments, addComment, setCommentsForTrack } = useComments();
  const { addCommentToTrack, fetchTrackComments, updateCommentOnTrack,deleteCommentFromTrack } = useTrackMutation();

  const [newComment, setNewComment] = useState("");
  const inputRef = useRef(null);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isPopupOpen,setIsPopupOpen] = useState(false)
 
// Open the ConfirmPopup with selected comment
const handleDeleteClick = (comment) => {
  setCommentToDelete(comment);
  setIsPopupOpen(true);
};

 

  // Handle Confirm Delete
const confirmDelete = async () => {
  if (commentToDelete) {
    await deleteCommentFromTrack(trackId, commentToDelete.id); 
    const updatedComments = await fetchTrackComments(trackId);
    setCommentsForTrack(trackId, updatedComments); // ✅ Update context
  }
  setIsPopupOpen(false);

};
  // ✅ Fetch comments once or when track changes
  useEffect(() => {
    const fetchComments = async () => {
      const latestComments = await fetchTrackComments(trackId);
      setCommentsForTrack(trackId, latestComments);
    };
    fetchComments();
  }, [trackId, fetchTrackComments, setCommentsForTrack]);

  // ✅ Auto-focus input when timestamp is selected
  useEffect(() => {
    if (selectedTimestamp !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedTimestamp]);

  // ✅ Add Comment Handler
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const timestamp = selectedTimestamp !== null ? selectedTimestamp : -1;
    const result = await addCommentToTrack(trackId, user, newComment, timestamp);

    if (result.success) {
      const updatedComments = await fetchTrackComments(trackId);
      setCommentsForTrack(trackId, updatedComments);
      setNewComment("");
      resetTimestamp();
    }
  };

  // ✅ Open Edit Modal
  const openEditModal = (comment) => {
    setEditingComment(comment);
    setEditText(comment.text);
    setIsModalOpen(true);
  };

  // ✅ Save Edited Comment
  const handleSaveEdit = async () => {
    if (!editingComment || !editText.trim()) return;
    const result = await updateCommentOnTrack(trackId, editingComment.id, {
      ...editingComment,
      text: editText,
      updatedAt: new Date().toLocaleString(),
    });

    if (result.success) {
      const updatedComments = await fetchTrackComments(trackId);
      setCommentsForTrack(trackId, updatedComments);
      setIsModalOpen(false);
    }
  };

  return (
    <div className={styles.commentsContainer}>
      <h3>Comments</h3>

      <ul className={styles.commentList}>
        {(comments[trackId] || []).map((comment, index) => (
          <li key={index} className={styles.commentItem}>
            <strong className={styles.timestamp}>
              {comment.time >= 0 ? `${comment.time.toFixed(2)}s | ` : "no stamp"}
              {comment.date}
            </strong>
            <br />
            <span className={styles.author}>By: {comment.author?.displayName || "Anonymous"}</span>
            <p>{comment.text}</p>
            {user?.uid === comment.author?.uid && (
  <>
    <span className={styles.editBtn} onClick={() => openEditModal(comment)}>✏ Edit</span>
    <span className={styles.deleteBtn} onClick={() => handleDeleteClick(comment)}>🗑 Delete</span>
  </>
)}
          </li>
        ))}
      </ul>
      <ConfirmPopup
  isOpen={isPopupOpen}
  onClose={() => setIsPopupOpen(false)}
  onConfirm={confirmDelete}
  message="Are you sure you want to delete this comment?"
/>
    {user && (
      <form onSubmit={handleAddComment}>
        <input
          ref={inputRef}
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={
            selectedTimestamp !== null
              ? `Add comment at: ${selectedTimestamp.toFixed(2)}s`
              : "Add a comment without time stamp"
          }
          className={`${styles.inputField} ${
            selectedTimestamp !== null ? styles.highlightPlaceholder : ""
          }`}
        />
         <button type="submit" className={styles.commentButton}>Comment</button>
      </form> 
      ) }


      {/* ✅ Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3>Edit Comment</h3>
        <textarea
          className={styles.editTextarea}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          rows={4}
        />
        <button className={styles.editComment} onClick={handleSaveEdit}>Save</button>
      </Modal>
    </div>
  );
};

export default CommentsSection;
