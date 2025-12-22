// Button.jsx
import "./Button.css";

export default function Button({ text, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`btn-primary ${className}`}
    >
      {text}
    </button>
  );
}
