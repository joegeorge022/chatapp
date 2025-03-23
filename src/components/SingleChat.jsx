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

  const isCurrentUser = message.user === auth.currentUser.displayName;

  return (
    <div 
      className="message" 
      style={{ 
        margin: "5px 0",
        padding: "10px",
        borderRadius: "12px",
        backgroundColor: isCurrentUser ? "#e6f7ff" : "#f0f0f0",
        maxWidth: "70%",
        wordBreak: "break-word",
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        alignSelf: isCurrentUser ? "flex-end" : "flex-start"
      }}
    >
      <div style={{ 
        fontWeight: "bold", 
        fontSize: "0.9em", 
        marginBottom: "4px",
        color: isCurrentUser ? "#0084ff" : "#333"
      }}>
        {message.user}
      </div>
      <div style={{ fontSize: "1em" }}>{message.text}</div>
      <div style={{ 
        fontSize: "0.7em", 
        color: "#888", 
        marginTop: "5px",
        textAlign: "right" 
      }}>
        {formatTime(message.createdAt)}
      </div>
    </div>
  );
}

export default SingleChat;