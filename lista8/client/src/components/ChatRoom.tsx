import { useRef, useEffect, useState, useCallback } from "react";
import MessageList from "./MessageList";
import TypingIndicator from "./TypingIndicator";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ChatRoom({
  room,
  messages,
  typingUsers,
  currentUser,
  onSendMessage,
  onTypingStart,
  onTypingStop,
  onLeaveRoom,
}) {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  // Focus input when room changes
  useEffect(() => {
    inputRef.current?.focus();
    setText("");
    setImagePreview(null);
    setImageFile(null);
  }, [room?.id]);

  const handleTyping = useCallback((value) => {
    if (!isTypingRef.current && value.length > 0) {
      isTypingRef.current = true;
      onTypingStart();
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onTypingStop();
    }, 1500);
    if (value.length === 0) {
      clearTimeout(typingTimeoutRef.current);
      isTypingRef.current = false;
      onTypingStop();
    }
  }, [onTypingStart, onTypingStop]);

  const handleTextChange = (e) => {
    setText(e.target.value);
    handleTyping(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageError("");
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image must be under 10MB");
      return;
    }
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setImageFile(file);
    e.target.value = "";
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setImageFile(null);
    setImageError("");
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed && !imageFile) return;

    clearTimeout(typingTimeoutRef.current);
    isTypingRef.current = false;
    onTypingStop();

    if (imageFile) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("image", imageFile);
        const res = await fetch("http://localhost:3001/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        onSendMessage(trimmed, data.imageUrl);
      } catch (err) {
        setImageError("Upload failed: " + err.message);
        setUploading(false);
        return;
      }
      setUploading(false);
      removeImage();
    } else {
      onSendMessage(trimmed, null);
    }

    setText("");
  };

  const handlePaste = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          setImageError("");
          if (file.size > MAX_IMAGE_SIZE) { setImageError("Image must be under 10MB"); return; }
          const url = URL.createObjectURL(file);
          setImagePreview(url);
          setImageFile(file);
        }
      }
    }
  };

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center"
        style={{ background: "var(--bg-primary)" }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
            No room selected
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Choose a room from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full flex-1" style={{ background: "var(--bg-primary)", minWidth: 0 }}>
      {/* Room header */}
      <div className="flex items-center gap-3 px-8 py-6 flex-shrink-0"
        style={{
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border-subtle)",
          boxShadow: "0 1px 0 rgba(0,0,0,0.2)",
        }}>
        <button
          onClick={() => onLeaveRoom(room.id)}
          className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 hidden sm:flex"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white" }}>
          #
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
            {room.name.replace("# ", "")}
          </h2>
          {room.description && (
            <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{room.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-2 h-2 rounded-full" style={{ background: "var(--success)" }} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Live</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-2" id="messages-container">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <span className="text-2xl">👋</span>
            </div>
            <p className="font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
              Welcome to {room.name}!
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Be the first to say something
            </p>
          </div>
        ) : (
          <MessageList messages={messages} currentUser={currentUser} />
        )}
        <TypingIndicator typingUsers={typingUsers} />
        <div ref={bottomRef} />
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="px-8 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--bg-secondary)" }}>
          <div className="relative inline-block">
            <img src={imagePreview} alt="preview" className="h-24 rounded-xl object-cover"
              style={{ border: "2px solid rgba(99,102,241,0.4)" }} />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "var(--danger)" }}>
              ×
            </button>
          </div>
          {imageError && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{imageError}</p>}
        </div>
      )}

      {/* Input area */}
      <div className="flex-shrink-0 px-4 py-3"
        style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--bg-secondary)" }}>
        <div className="flex items-end gap-3 rounded-2xl px-1 py-1"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(99,102,241,0.25)",
          }}>

          {/* Image attach button */}
          <button
            id="attach-image-btn"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex-shrink-0 mb-0.5 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150"
            style={{
              background: imageFile ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)",
              color: imageFile ? "#818cf8" : "var(--text-muted)",
            }}
            title="Attach image">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />

          {/* Text input */}
          <textarea
            ref={inputRef}
            id="message-input"
            rows={1}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={`Message ${room.name}...`}
            className="flex-1 bg-transparent outline-none resize-none text-sm leading-relaxed"
            style={{
              color: "var(--text-primary)",
              caretColor: "#818cf8",
              minHeight: "24px",
              maxHeight: "120px",
              overflowY: "auto",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 120) + "px";
            }}
          />

          {/* Send button */}
          <button
            id="send-message-btn"
            onClick={handleSend}
            disabled={(!text.trim() && !imageFile) || uploading}
            className="flex-shrink-0 mb-0.5 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{
              background: (text.trim() || imageFile) && !uploading
                ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                : "rgba(99,102,241,0.15)",
              color: (text.trim() || imageFile) && !uploading ? "white" : "rgba(255,255,255,0.3)",
              cursor: (text.trim() || imageFile) && !uploading ? "pointer" : "not-allowed",
              boxShadow: (text.trim() || imageFile) ? "0 2px 10px rgba(99,102,241,0.35)" : "none",
            }}>
            {uploading ? (
              <span className="typing-dot" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-center text-xs mt-2" style={{ color: "var(--text-muted)" }}>
          Press <kbd className="px-1 py-0.5 rounded text-xs" style={{ background: "rgba(255,255,255,0.08)" }}>Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded text-xs" style={{ background: "rgba(255,255,255,0.08)" }}>Shift+Enter</kbd> for new line · paste images directly
        </p>
      </div>
    </div>
  );
}
