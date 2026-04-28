import { useState } from "react";

export default function Sidebar({
  currentUser,
  rooms,
  currentRoom,
  members,
  onJoinRoom,
  onLeaveRoom,
  onCreateRoom,
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");
  const [createError, setCreateError] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    const name = newRoomName.trim();
    if (name.length < 2) return setCreateError("Name must be at least 2 chars");
    if (!/^[a-zA-Z0-9\s-]+$/.test(name)) return setCreateError("Letters, numbers, spaces, hyphens only");
    onCreateRoom(name, newRoomDesc.trim(), (res) => {
      if (res.error) return setCreateError(res.error);
      setShowCreate(false);
      setNewRoomName("");
      setNewRoomDesc("");
      setCreateError("");
    });
  };

  return (
    <aside className="flex flex-col h-full select-none w-full"
      style={{
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-subtle)",
      }}>


      {/* Rooms section */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="flex items-center justify-between px-6 py-4 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Rooms
          </span>
          <button
            id="create-room-btn"
            onClick={() => { setShowCreate(!showCreate); setCreateError(""); }}
            className="w-5 h-5 rounded flex items-center justify-center transition-colors duration-150 text-lg leading-none"
            style={{ color: "var(--text-muted)", background: "transparent" }}
            title="Create room"
          >
            {showCreate ? "×" : "+"}
          </button>
        </div>

        {/* Create room form */}
        {showCreate && (
          <div className="mx-3 mb-3 p-3 rounded-xl"
            style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}>
            <form onSubmit={handleCreate} className="space-y-2">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => { setNewRoomName(e.target.value); setCreateError(""); }}
                placeholder="Room name"
                maxLength={30}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "var(--text-primary)",
                }}
              />
              <input
                type="text"
                value={newRoomDesc}
                onChange={(e) => setNewRoomDesc(e.target.value)}
                placeholder="Description (optional)"
                maxLength={60}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "var(--text-primary)",
                }}
              />
              {createError && <p className="text-xs" style={{ color: "var(--danger)" }}>{createError}</p>}
              <button
                type="submit"
                className="w-full py-1.5 rounded-lg text-xs font-medium"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white" }}
              >
                Create Room
              </button>
            </form>
          </div>
        )}

        {/* Room list */}
        {rooms.map((room) => {
          const isActive = currentRoom?.id === room.id;
          return (
            <button
              key={room.id}
              id={`room-btn-${room.id}`}
              onClick={() => onJoinRoom(room.id)}
              className="w-full flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-150 text-left group mb-1"
              style={{
                background: isActive ? "rgba(99,102,241,0.2)" : "transparent",
                border: isActive ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
                width: "calc(100% - 16px)",
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-150"
                style={{
                  background: isActive ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.06)",
                  color: isActive ? "white" : "var(--text-muted)",
                }}>
                #
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: isActive ? "var(--text-primary)" : "var(--text-secondary)" }}>
                  {room.name.replace("# ", "")}
                </div>
                <div className="flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{room.memberCount}</span>
                </div>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#6366f1", boxShadow: "0 0 6px #6366f1" }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Members panel */}
      {currentRoom && members.length > 0 && (
        <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <div className="px-6 pt-4 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Members — {members.length}
            </span>
          </div>
          <div className="px-3 pb-2 max-h-36 overflow-y-auto space-y-1">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: m.avatar }}>
                  {m.nickname[0].toUpperCase()}
                </div>
                <span className="text-xs font-medium truncate"
                  style={{ color: m.id === currentUser?.id ? "#818cf8" : "var(--text-secondary)" }}>
                  {m.nickname}
                  {m.id === currentUser?.id && <span className="ml-1" style={{ color: "var(--text-muted)" }}>(you)</span>}
                </span>
                <div className="w-1.5 h-1.5 rounded-full ml-auto flex-shrink-0" style={{ background: "var(--success)" }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current user bar */}
      <div className="flex items-center gap-3 px-6 py-4"
        style={{ borderTop: "1px solid var(--border-subtle)", background: "rgba(0,0,0,0.2)" }}>
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: currentUser?.avatar }}>
            {currentUser?.nickname[0].toUpperCase()}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
            style={{ background: "var(--success)", borderColor: "var(--bg-secondary)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
            {currentUser?.nickname}
          </div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Online</div>
        </div>
        {currentRoom && (
          <button
            id="leave-room-btn"
            onClick={() => onLeaveRoom(currentRoom.id)}
            title="Leave room"
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
            style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.05)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        )}
      </div>
    </aside>
  );
}
