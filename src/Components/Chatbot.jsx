// file: src/components/Chatbot.jsx
import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../services/chatAPI";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hey there! 🌿 Welcome to PlantShop. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setLoading(true);

    try {
      const response = await sendChatMessage(userMessage, "user_" + Date.now());
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: response.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Sorry, something went wrong. Please try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===== CHAT WINDOW (shows when open) ===== */}
      {isOpen && (
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <span>🌿 PlantShop Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              style={styles.closeBtn}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                ...styles.message,
                alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                backgroundColor: msg.from === "user" ? "#4CAF50" : "#f1f1f1",
                color: msg.from === "user" ? "white" : "#333",
              }}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{ ...styles.message, backgroundColor: "#f1f1f1", color: "#999" }}>
                Typing...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={styles.inputArea}>
            <input
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me anything..."
              autoFocus
            />
            <button style={styles.sendBtn} onClick={sendMessage}>
              ➤
            </button>
          </div>
        </div>
      )}

      {/* ===== FLOATING ICON BUTTON ===== */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={styles.fab}
        title="Chat with us"
      >
        {isOpen ? "✕" : "🌻"}
      </button>
    </>
  );
};

const styles = {
  // Floating action button
  fab: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: "24px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(76,175,80,0.4)",
    zIndex: 1001,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease",
  },

  // Chat window
  container: {
    position: "fixed",
    bottom: "90px",
    right: "24px",
    width: "350px",
    height: "480px",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 1000,
    animation: "slideUp 0.2s ease",
  },

  // Header
  header: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "14px 16px",
    fontWeight: "bold",
    fontSize: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    padding: "0 4px",
  },

  // Messages area
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  message: {
    padding: "10px 14px",
    borderRadius: "18px",
    maxWidth: "75%",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  // Input area
  inputArea: {
    display: "flex",
    padding: "10px 12px",
    borderTop: "1px solid #eee",
    gap: "8px",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: "9px 14px",
    borderRadius: "20px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "14px",
  },
  sendBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default Chatbot;