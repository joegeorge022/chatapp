import React from "react";
import { auth } from "../firebase-config";

function SingleChat({ message }) {
  // Format timestamp correctly
  const formatTime = (timestamp) => {
    if (!timestamp) return "Sending...";
    
    // Handle both Firestore timestamp objects and server timestamps
    try {
      // If it's a Firestore timestamp (has toDate method)
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleTimeString();
      } 
      // If it's already a Date object or timestamp number
      return new Date(timestamp).toLocaleTimeString();
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "Timestamp error";
    }
  };

  return (
    <div 
      className="message" 
      style={{ 
        margin: "10px 0",
        padding: "8px",
        borderRadius: "5px",
        backgroundColor: message.user === auth.currentUser.displayName ? "#e6f7ff" : "#f0f0f0",
        alignSelf: message.user === auth.currentUser.displayName ? "flex-end" : "flex-start",
        maxWidth: "70%",
        wordBreak: "break-word"
      }}
    >
      <div style={{ fontWeight: "bold" }}>{message.user}</div>
      <div>{message.text}</div>
      <div style={{ fontSize: "0.8em", color: "#888", marginTop: "5px" }}>
        {formatTime(message.createdAt)}
      </div>
    </div>
  );
}

export default SingleChat;