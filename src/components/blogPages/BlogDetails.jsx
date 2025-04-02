import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPenNib, faCalendarAlt, faEye, faComment } from "@fortawesome/free-solid-svg-icons";
import useBlogMutation from "../../hooks/useBlogMutation";
import styles from "./BlogDetails.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { useUserProfile } from "../../hooks/useUserProfile"; 
import Modal from "../shared/App/Modal";
import ConfirmPopup from "../shared/App/ConfirmPopup";

const BlogDetails = () => {
  const { id } = useParams(); // ✅ Get the blog ID from the URL
  const { user, loading} = useAuth();
  const { getBlog, postCommentToBlog, fetchBlogComments,editCommentOfBlog,deleteCommentOfBlog, trackUserView, fetchBlogViews } = useBlogMutation();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const {  fetchProfileField } = useUserProfile();
  const [displayName, setDisplayName] = useState();

  //modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editText, setEditText] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  //popup
  const [showConfirm, setShowConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  

  // ✅ Fetch the blog on mount
  useEffect(() => {
    const fetchBlog = async () => {
      const blogData = await getBlog(id);
      console.log("Blog DAta", blogData)
      if (blogData) {
        setBlog(blogData);
        const commentsFetch = await fetchBlogComments(id); 
        console.log(commentsFetch)
        console.log(id)
        setComments(commentsFetch || []);

        if (user?.uid && user.uid !== blogData.author.uid) {
          await trackUserView(id, user.uid);  // ✅ Log view if not author
        }
  
        const totalViews = await fetchBlogViews(id);
        setBlog((prev) => ({ ...prev, uniqueViews: totalViews }));
        console.log(user)
      }
    };
    fetchBlog();
  }, [id]);

  useEffect(() => {
    const fetchUserDetails = async ()=> {
    if (user?.uid) {
      const profile = await fetchProfileField(user.uid);
      
      setDisplayName(profile?.displayName || "Anonymous");
    }
  }
  fetchUserDetails();
  },[])

  
  if (!blog) {
    return <p className={styles.error}> Blog not found.</p>;
  }

  const avatarSrc = blog.author?.avatar || "/default_avatar.png";
  const blogImg = blog.imageUrl || "/header.png";
  

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    
    const commentObj = {
      text: newComment,
      date: new Date().toLocaleString(),
      author: displayName || "Anonymous" ,
      authorId: user.uid,


    };

    // ✅ Add to Firestore
    const result = await postCommentToBlog(id, commentObj);
    if (result.success) {
      // ✅ Update local UI after successful Firestore save
      setComments((prev) => [...prev, { ...commentObj, id: result.id }]);
      setNewComment("");
    } else {
      alert("Failed to post comment");
    }
  };

  const handleEditComment = async (commentId, updatedText) => {
    const updatedComment = {
      text: updatedText,
      date: new Date().toLocaleString(),
      author: displayName || "Anonymous",
      authorId: user.uid,
    };
    const result = await editCommentOfBlog(id, commentId, updatedComment);
    if (result.success) {
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, ...updatedComment } : c))
      );
    } else {
      //console.log(result);
      alert("Failed to edit comment");
    }
  };

  const confirmDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
    setShowConfirm(true);
  };
  
  const handleConfirmDelete = async () => {
    const result = await deleteCommentOfBlog(id, commentToDelete);
    if (result.success) {
      setComments((prev) => prev.filter((c) => c.id !== commentToDelete));
    } else {
      alert("Failed to delete comment");
    }
    setShowConfirm(false);
  };

  const openEditModal = (comment) => {
    setEditText(comment.text);
    setEditCommentId(comment.id);
    setIsModalOpen(true);
  };
  
  const handleEditSave = async () => {
    await handleEditComment(editCommentId, editText);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.blogContainer}>
                      <ConfirmPopup
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleConfirmDelete}
  message="Are you sure you want to delete this comment?" 
/>
      <div className={styles.blogCard}>
        <img src={blogImg} alt={blog.title} className={styles.image} />

        <div className={styles.details}>
          <img src={avatarSrc} alt="avatar" className={styles.avatar} />
          <div className={styles.info}>
            <h2 className={styles.title}>{blog.title}</h2>
            <p className={styles.category}><FontAwesomeIcon icon={faBook} /> {blog.category}</p>
            <p className={styles.publisher}><FontAwesomeIcon icon={faPenNib} /> By {blog.author?.displayName || "Unknown"}</p>
            <p className={styles.date}><FontAwesomeIcon icon={faCalendarAlt} /> Posted on {new Date(blog.createdAt?.seconds * 1000).toLocaleDateString()}</p>
            <p className={styles.stats}><FontAwesomeIcon icon={faEye} /> {blog.uniqueViews || 0} views • {comments.length} comments</p>
            {blog.category === "events" && (
              <div className={styles.eventDetails}>
                <h3>🎤 Event Info</h3>
                <p>Price: {blog.price} BGN</p>
                <p className={styles.date}>Date: {new Date(blog.date).toLocaleDateString()}</p>
                <p>Location: {blog.location}</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.content}>
          <p>{blog.content}</p>
        </div>

        <div className={styles.commentsSection}>
          <h3><FontAwesomeIcon icon={faComment} /> Comments</h3>
          {comments.length === 0 ? (
            <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
          ) : (
            <ul className={styles.commentsList}>
            {comments.map((comment, index) => (
  <li key={comment.id} className={styles.comment}>
    <p>{comment.text}</p>
    <div className={styles.commentDiv}>
      <span className={styles.commentDate}>{comment.date}</span>
      {comment.authorId === user.uid ? (
        <div>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <h3>Edit Comment</h3>
  <textarea 
    value={editText}
    onChange={(e) => setEditText(e.target.value)}
    rows={4}
    style={{ width: "100%" }}
  />
  <button onClick={handleEditSave}>Save</button>
      </Modal>

          <span>by: me</span>
          <span
          className={styles.editComment}
         onClick={() => openEditModal(comment)}
            >edit</span>
          <span
            className={styles.deleteComment}
            onClick={() => confirmDeleteComment(comment.id)}
          >delete</span>

        </div>
      ) : (
        <span>by: {comment.author}</span>
      )}
        </div>
          </li>
              ))}
            </ul>
          )}

          <div className={styles.addComment}>
            <textarea 
              className={styles.commentInput}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
             <button
  className={styles.commentButton}
  onClick={handleAddComment}
  disabled={!user || loading}
>
{loading ? "Checking login..." : user ? "Add Comment" : "Login to add comment"}
</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
