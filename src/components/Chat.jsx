import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
import SendIcon from "@mui/icons-material/Send";
import SingleChat from "./SingleChat";

function Chat(props) {
  const [msgs, setMgs] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  // Always create fresh collection reference
  const getMessageRef = () => collection(db, "messages");

  // Improved scroll handling
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
        user: auth.currentUser.displayName,
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
      <h1>{props.room} Chatroom</h1>
      <div 
        id="chat-window" 
        style={{ 
          height: "400px", 
          overflowY: "auto", 
          border: "1px solid #ccc", 
          padding: "10px", 
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          width: "100%"
        }}
      >
        {msgs && msgs.length > 0 ? (
          msgs.map((message) => (
            <div 
              key={message.id} 
              className="message-container"
              style={{
                display: "flex", 
                justifyContent: message.user === auth.currentUser.displayName ? "flex-end" : "flex-start",
                width: "100%",
                marginBottom: "10px"
              }}
            >
              <SingleChat message={message} />
            </div>
          ))
        ) : (
          <p>No messages in this room yet. Be the first to send a message!</p>
        )}
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", width: "100%" }}>
        <input
          type="text"
          placeholder="Type your message here..."
          onChange={(e) => setNewMsg(e.target.value)}
          value={newMsg}
          style={{ flexGrow: 1, padding: "10px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "10px" }}>
          <SendIcon />
        </button>
      </form>
    </div>
  );
}

export default Chat;