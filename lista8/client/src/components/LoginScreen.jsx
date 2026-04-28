import { useState } from "react";

const AVATAR_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#f97316", "#22c55e", "#06b6d4", "#3b82f6",
];

export default function LoginScreen({ onJoin, error, loading }) {
  const [nickname, setNickname] = useState("");
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim().length >= 2) {
      onJoin(nickname.trim(), selectedColor);
    }
  };

  const initials = nickname.trim() ? nickname.trim()[0].toUpperCase() : "?";

  return (
    <div className="flex items-center justify-center h-full w-full relative overflow-hidden"
      style={{ background: "var(--bg-primary)" }}>

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #ec4899, transparent)" }} />
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(26,26,48,0.95), rgba(30,30,53,0.95))",
          border: "1px solid rgba(99,102,241,0.3)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
        }}>

        {/* Header strip */}
        <div className="h-1 w-full"
          style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)" }} />

        <div className="p-8">
          {/* Logo & title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 glow-ring"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
              Welcome to <span style={{ color: "#818cf8" }}>NexusChat</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Choose a nickname to start chatting
            </p>
          </div>

          {/* Avatar preview */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white transition-all duration-300 glow-ring"
                style={{ background: selectedColor, boxShadow: `0 0 20px ${selectedColor}66` }}>
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{ background: "var(--success)", borderColor: "var(--bg-secondary)" }}>
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
          </div>

          {/* Color picker */}
          <div className="mb-6">
            <label className="block text-xs font-medium mb-2 uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}>
              Avatar Color
            </label>
            <div className="flex gap-2 justify-center flex-wrap">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className="w-8 h-8 rounded-full transition-all duration-200 hover:scale-110"
                  style={{
                    background: color,
                    outline: selectedColor === color ? `2px solid white` : "none",
                    outlineOffset: "2px",
                    boxShadow: selectedColor === color ? `0 0 12px ${color}88` : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}>
                Nickname
              </label>
              <input
                id="nickname-input"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. CoolUser42"
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 text-sm"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "var(--text-primary)",
                  caretColor: "#818cf8",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#6366f1";
                  e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(99,102,241,0.3)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <div className="flex justify-between mt-1">
                {error ? (
                  <span className="text-xs" style={{ color: "var(--danger)" }}>⚠ {error}</span>
                ) : (
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {nickname.trim().length < 2 ? "Minimum 2 characters" : "Looks good!"}
                  </span>
                )}
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{nickname.length}/20</span>
              </div>
            </div>

            <button
              id="join-chat-btn"
              type="submit"
              disabled={nickname.trim().length < 2 || loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 relative overflow-hidden"
              style={{
                background: nickname.trim().length >= 2
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "rgba(99,102,241,0.3)",
                color: nickname.trim().length >= 2 ? "white" : "rgba(255,255,255,0.4)",
                cursor: nickname.trim().length >= 2 ? "pointer" : "not-allowed",
                boxShadow: nickname.trim().length >= 2 ? "0 4px 15px rgba(99,102,241,0.4)" : "none",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </span>
              ) : (
                "Join NexusChat →"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
