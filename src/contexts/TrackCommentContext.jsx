import React, { createContext, useContext, useState } from "react";

// Create the Comment Context
const TrackCommentContext = createContext();

// Hook to use the Comment Context
export const useComments = () => useContext(TrackCommentContext);

// Provider component
export const TrackCommentProvider = ({ children }) => {
  const [comments, setComments] = useState({}); 

  // ✅ Add a single comment
  const addComment = (trackId, time, commentData) => {
    setComments((prevComments) => {
      const newComments = {
        ...prevComments,
        [trackId]: [
          ...(prevComments[trackId] || []),
          { time: parseFloat(time), ...commentData },
        ],
      };
      console.log("Updated Comments:", newComments); 
      return newComments;
    });
  };

  // ✅ Replace all comments for a specific track (prevents duplicates)
  const setCommentsForTrack = (trackId, commentsArray) => {
    setComments((prevComments) => ({
      ...prevComments,
      [trackId]: commentsArray,
    }));
  };

  return (
    <TrackCommentContext.Provider value={{ comments, addComment, setCommentsForTrack }}>
      {children}
    </TrackCommentContext.Provider>
  );
};
