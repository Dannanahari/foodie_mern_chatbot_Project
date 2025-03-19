import React, { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Function to send messages to Dialogflow via backend
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const response = await fetch("https://foodie-mern-chatbot-project-backend.onrender.com/api/dialogflow/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }), // Send user input
      });

      const data = await response.json();
      const botMessage = data.fulfillmentText || "Sorry, I didn’t understand that.";

      // Add bot response to chat
      setMessages([...newMessages, { sender: "bot", text: botMessage }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([...newMessages, { sender: "bot", text: "Something went wrong. Try again later." }]);
    }

    setInput("");
  };

  return (
    <div className="chat-container" style={{ position: "fixed", bottom: "20px", right: "20px", width: "300px", border: "1px solid #ccc", padding: "10px", background: "white" }}>
      <div className="chat-box" style={{ height: "300px", overflowY: "auto", marginBottom: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left", margin: "5px" }}>
            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "80%", padding: "5px" }}
      />
      <button onClick={sendMessage} style={{ padding: "5px", marginLeft: "5px" }}>Send</button>
    </div>
  );
};

export default Chatbot;
