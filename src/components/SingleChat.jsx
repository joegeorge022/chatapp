import React from "react";
import { auth } from "../firebase-config";

function SingleChat({ message }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return "Sending...";
    
    try {
      if (timestamp.toDate) {
        const date = timestamp.toDate();
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } 
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        backgroundColor: isCurrentUser ? "#3924a3" : "#f0f0f0",
        color: isCurrentUser ? "white" : "#333",
        alignSelf: isCurrentUser ? "flex-end" : "flex-start",
        borderBottomRightRadius: isCurrentUser ? "4px" : "18px",
        borderBottomLeftRadius: isCurrentUser ? "18px" : "4px",
      }}
    >
      <div style={{ 
        fontWeight: "bold", 
        fontSize: "0.9em", 
        marginBottom: "4px",
        color: isCurrentUser ? "rgba(255, 255, 255, 0.9)" : "#555"
      }}>
        {message.user}
      </div>
      <div style={{ fontSize: "1em" }}>{message.text}</div>
      <div style={{ 
        fontSize: "0.7em", 
        color: isCurrentUser ? "rgba(255, 255, 255, 0.7)" : "#888", 
        marginTop: "5px",
        textAlign: "right" 
      }}>
        {formatTime(message.createdAt)}
      </div>
    </div>
  );
}

export default SingleChat;