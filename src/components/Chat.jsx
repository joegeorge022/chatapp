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
  const messageRef = collection(db, "messages");
  const [msgs, setMgs] = useState([]);

  function updateScroll() {
    var element = document.getElementById("chat-window");
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }
  
  useEffect(() => {
    updateScroll();
  }, [msgs]);

  useEffect(() => {
    const queryMessage = query(
      messageRef,
      where("room", "==", props.room),
      orderBy("createdAt")
    );
    
    const unsubscribe = onSnapshot(queryMessage, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      console.log("Messages received:", messages); // Debug line
      setMgs(messages);
    }, (error) => {
      console.error("Error fetching messages:", error);
    });
    
    return () => unsubscribe();
  }, [props.room, messageRef]); // Added props.room to dependency array

  const [newMsg, setNewMsg] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMsg === "") return;

    try {
      await addDoc(messageRef, {
        text: newMsg,
        user: auth.currentUser.displayName,
        createdAt: serverTimestamp(),
        room: props.room,
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
          overflowY: "scroll", 
          border: "1px solid #ccc", 
          padding: "10px", 
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column"
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
                width: "100%"
              }}
            >
              <SingleChat message={message} />
            </div>
          ))
        ) : (
          <p>No messages in this room yet. Be the first to send a message!</p>
        )}
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex" }}>
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