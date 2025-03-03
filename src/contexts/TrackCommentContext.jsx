import React, { createContext, useContext, useState } from "react";

// Create the Comment Context
const TrackCommentContext = createContext();

// Hook to use the Comment Context
export const useComments = () => useContext(TrackCommentContext);

// Provider component
export const TrackCommentProvider = ({ children }) => {
  const [comments, setComments] = useState({}); 

 
  const addComment = (trackId, time, commentData) => {
    setComments((prevComments) => {
      const newComments = {
        ...prevComments,
        [trackId]: [
          ...(prevComments[trackId] || []),
          { time: parseFloat(time), text: commentData.text, date: commentData.date }, 
        ],
      };
      
      console.log("Updated Comments:", newComments); 
      return newComments;
    });
};
  return (
    <TrackCommentContext.Provider value={{ comments, addComment }}>
      {children}
    </TrackCommentContext.Provider>
  );
};
