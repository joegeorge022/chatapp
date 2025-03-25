import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase-config";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from "firebase/firestore";
import SingleChat from "./SingleChat";

function Chat(props) {
  const [msgs, setMgs] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const getMessageRef = () => collection(db, "messages");

  useEffect(() => {
    const element = document.getElementById("chat-window");
    if (element) {
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [msgs]);

  useEffect(() => {
    const queryMessage = query(
      getMessageRef(),
      where("room", "==", props.room),
      orderBy("createdAt", "asc")
    );
    
    const unsubscribe = onSnapshot(queryMessage, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMgs(messages);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setMgs([]);
    });
    
    return () => unsubscribe();
  }, [props.room]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    try {
      await addDoc(getMessageRef(), {
        text: newMsg.trim(),
        user: auth.currentUser.displayName || "Anonymous User",
        createdAt: serverTimestamp(),
        room: props.room
      });
      setNewMsg("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  return (
    <div className="chat">
      <div className="chat-header">
        <button 
          className="back-btn" 
          onClick={() => props.setRoom("")}
        >
          ← Back
        </button>
        <h1>{props.room} Chatroom</h1>
      </div>
      <div id="chat-window">
        {msgs && msgs.length > 0 ? (
          msgs.map((message) => (
            <div 
              key={message.id} 
              className="message-container"
              style={{
                display: "flex", 
                justifyContent: message.user === auth.currentUser.displayName ? "flex-end" : "flex-start",
              }}
            >
              <SingleChat message={message} />
            </div>
          ))
        ) : (
          <div className="no-messages">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">
          <span>➤</span>
        </button>
      </form>
    </div>
  );
}

export default Chat;