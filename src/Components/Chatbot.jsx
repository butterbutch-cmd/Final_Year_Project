import { useState, useRef, useEffect } from "react";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  .chat-root * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .chat-root {
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Window ── */
  .chat-window {
    position: fixed;
    bottom: 100px;
    right: 24px;
    width: 360px;
    height: 520px;
    background: #faf9f6;
    border-radius: 20px;
    box-shadow:
      0 4px 6px -1px rgba(0,0,0,0.04),
      0 24px 60px -8px rgba(30, 60, 40, 0.22),
      0 0 0 1px rgba(30, 60, 40, 0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 9999;
    transform-origin: bottom right;
    animation: windowIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  @keyframes windowIn {
    from { opacity: 0; transform: scale(0.88) translateY(12px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* ── Header ── */
  .chat-header {
    background: linear-gradient(135deg, #1c3d2a 0%, #2d5c40 100%);
    padding: 18px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }

  .chat-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 80% -20%, rgba(120,200,120,0.18) 0%, transparent 60%);
    pointer-events: none;
  }

  .header-icon {
    width: 36px;
    height: 36px;
    background: rgba(255,255,255,0.12);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255,255,255,0.15);
  }

  .header-text {
    flex: 1;
  }

  .header-title {
    font-family: 'DM Serif Display', serif;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0.01em;
    line-height: 1.2;
  }

  .header-subtitle {
    font-size: 11px;
    color: rgba(255,255,255,0.55);
    font-weight: 300;
    letter-spacing: 0.04em;
    margin-top: 2px;
  }

  .status-dot {
    width: 7px;
    height: 7px;
    background: #6ee09a;
    border-radius: 50%;
    box-shadow: 0 0 0 2px rgba(110,224,154,0.3);
    animation: pulse 2.5s ease-in-out infinite;
    margin-top: 4px;
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 2px rgba(110,224,154,0.3); }
    50%       { box-shadow: 0 0 0 5px rgba(110,224,154,0.1); }
  }

  .close-btn {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.7);
    width: 28px;
    height: 28px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .close-btn:hover {
    background: rgba(255,255,255,0.2);
    color: #fff;
  }

  /* ── Messages ── */
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    scroll-behavior: smooth;
  }

  .chat-messages::-webkit-scrollbar {
    width: 4px;
  }

  .chat-messages::-webkit-scrollbar-track {
    background: transparent;
  }

  .chat-messages::-webkit-scrollbar-thumb {
    background: #d4e6d6;
    border-radius: 4px;
  }

  .msg-row {
    display: flex;
    flex-direction: column;
    animation: msgIn 0.25s ease forwards;
  }

  @keyframes msgIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .msg-row.user {
    align-items: flex-end;
  }

  .msg-row.bot {
    align-items: flex-start;
  }

  .msg-bubble {
    max-width: 80%;
    padding: 10px 15px;
    border-radius: 16px;
    font-size: 13.5px;
    line-height: 1.55;
    font-weight: 400;
  }

  .msg-bubble.user {
    background: linear-gradient(135deg, #2d5c40, #3d7a56);
    color: #ffffff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 2px 12px rgba(45,92,64,0.3);
  }

  .msg-bubble.bot {
    background: #ffffff;
    color: #2c3e2d;
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
  }

  /* ── Typing indicator ── */
  .typing-bubble {
    background: #ffffff;
    padding: 12px 16px;
    border-radius: 16px;
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
    display: flex;
    gap: 5px;
    align-items: center;
    width: fit-content;
  }

  .typing-dot {
    width: 6px;
    height: 6px;
    background: #7caa8a;
    border-radius: 50%;
    animation: typingBounce 1.3s ease-in-out infinite;
  }

  .typing-dot:nth-child(2) { animation-delay: 0.18s; }
  .typing-dot:nth-child(3) { animation-delay: 0.36s; }

  @keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
    30%           { transform: translateY(-5px); opacity: 1; }
  }

  /* ── Input area ── */
  .chat-input-area {
    padding: 12px 14px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    background: #faf9f6;
    border-top: 1px solid rgba(0,0,0,0.06);
    flex-shrink: 0;
  }

  .chat-input {
    flex: 1;
    padding: 10px 16px;
    border-radius: 50px;
    border: 1.5px solid #dceadf;
    background: #ffffff;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    color: #2c3e2d;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .chat-input::placeholder {
    color: #aabcad;
  }

  .chat-input:focus {
    border-color: #3d7a56;
    box-shadow: 0 0 0 3px rgba(61,122,86,0.1);
  }

  .send-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2d5c40, #3d7a56);
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease;
    box-shadow: 0 2px 10px rgba(45,92,64,0.35);
  }

  .send-btn:hover:not(:disabled) {
    transform: scale(1.08);
    box-shadow: 0 4px 16px rgba(45,92,64,0.45);
  }

  .send-btn:active:not(:disabled) {
    transform: scale(0.95);
  }

  .send-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .send-icon {
    width: 15px;
    height: 15px;
    fill: none;
    stroke: white;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
    transform: translateX(1px);
  }

  /* ── FAB ── */
  .fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1c3d2a 0%, #2d5c40 100%);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
      0 4px 14px rgba(30,60,40,0.4),
      0 0 0 0 rgba(61,122,86,0);
    z-index: 9999;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
  }

  .fab:hover {
    transform: scale(1.1);
    box-shadow:
      0 6px 20px rgba(30,60,40,0.5),
      0 0 0 8px rgba(61,122,86,0.1);
  }

  .fab:active {
    transform: scale(0.95);
  }

  .fab-icon {
    font-size: 22px;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .fab.open .fab-icon {
    transform: rotate(45deg) scale(0.9);
  }
`;

const SendIcon = () => (
  <svg className="send-icon" viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! I'm your plant care assistant. Ask me anything about plants, care tips, or finding your perfect green companion. 🌿",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const sessionId = useRef(
    localStorage.getItem("chat_session") || `guest_${Date.now()}`
  );

  useEffect(() => {
    localStorage.setItem("chat_session", sessionId.current);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/chatbot/chat",
        { message: userText },
        { headers: { "x-session-id": sessionId.current } }
      );
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-root">
      <style>{styles}</style>

      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="header-icon">🌻</div>
            <div className="header-text">
              <div className="header-title">Plant Assistant</div>
              <div className="header-subtitle">Always here to help</div>
            </div>
            <div className="status-dot" />
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg-row ${msg.role}`}>
                <div className={`msg-bubble ${msg.role}`}>{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="msg-row bot">
                <div className="typing-bubble">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <input
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about plants…"
            />
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={loading}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        className={`fab ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((p) => !p)}
      >
        <span className="fab-icon">{isOpen ? "✕" : "🌻"}</span>
      </button>
    </div>
  );
};

export default Chatbot;