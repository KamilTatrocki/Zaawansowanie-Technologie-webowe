import { useState, useRef } from "react";

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  if (isToday) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function AvatarCircle({ nickname, color, size = 32 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}
    >
      {nickname[0].toUpperCase()}
    </div>
  );
}

function SystemMessage({ msg }) {
  return (
    <div className="flex justify-center my-4 msg-system">
      <span className="text-xs px-4 py-2 rounded-full"
        style={{
          background: "rgba(255,255,255,0.05)",
          color: "var(--text-muted)",
          border: "1px solid var(--border-subtle)",
        }}>
        {msg.text}
      </span>
    </div>
  );
}

function TextBubble({ msg, isSelf }) {
  return (
    <div
      className={`flex gap-2.5 items-end max-w-xs md:max-w-md lg:max-w-lg ${isSelf ? "msg-right flex-row-reverse" : "msg-left flex-row"}`}
    >
      {!isSelf && (
        <AvatarCircle nickname={msg.sender.nickname} color={msg.sender.avatar} size={30} />
      )}

      <div className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
        {!isSelf && (
          <span className="text-xs font-semibold mb-1 px-1"
            style={{ color: msg.sender.avatar }}>
            {msg.sender.nickname}
          </span>
        )}
        <div
          className="relative px-3 py-2 text-sm leading-relaxed break-words"
          style={{
            background: isSelf
              ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
              : "rgba(255,255,255,0.07)",
            color: "var(--text-primary)",
            borderRadius: isSelf ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            boxShadow: isSelf
              ? "0 4px 15px rgba(99,102,241,0.35)"
              : "0 2px 8px rgba(0,0,0,0.2)",
            border: isSelf ? "none" : "1px solid rgba(255,255,255,0.08)",
            maxWidth: "100%",
            wordBreak: "break-word",
          }}
        >
          {msg.text}
        </div>
        <span className="text-xs mt-1 px-1" style={{ color: "var(--text-muted)" }}>
          {formatTime(msg.timestamp)}
        </span>
      </div>

      {isSelf && (
        <AvatarCircle nickname={msg.sender.nickname} color={msg.sender.avatar} size={30} />
      )}
    </div>
  );
}

function ImageBubble({ msg, isSelf }) {
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <div className={`flex gap-2.5 items-end max-w-xs md:max-w-md lg:max-w-lg ${isSelf ? "msg-right flex-row-reverse" : "msg-left flex-row"}`}>
        {!isSelf && (
          <AvatarCircle nickname={msg.sender.nickname} color={msg.sender.avatar} size={30} />
        )}

        <div className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
          {!isSelf && (
            <span className="text-xs font-semibold mb-1 px-1" style={{ color: msg.sender.avatar }}>
              {msg.sender.nickname}
            </span>
          )}
          <div
            className="overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
            style={{
              borderRadius: isSelf ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              boxShadow: isSelf ? "0 4px 15px rgba(99,102,241,0.35)" : "0 2px 8px rgba(0,0,0,0.25)",
              border: isSelf ? "2px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.08)",
              maxWidth: "260px",
            }}
            onClick={() => setLightbox(true)}
          >
            <img
              src={msg.imageUrl}
              alt="shared"
              className="block w-full object-cover"
              style={{ maxHeight: "220px" }}
            />
            {msg.text && (
              <div className="px-3 py-2 text-sm"
                style={{
                  background: isSelf ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.07)",
                  color: "var(--text-primary)",
                }}>
                {msg.text}
              </div>
            )}
          </div>
          <span className="text-xs mt-1 px-1" style={{ color: "var(--text-muted)" }}>
            {formatTime(msg.timestamp)}
          </span>
        </div>

        {isSelf && (
          <AvatarCircle nickname={msg.sender.nickname} color={msg.sender.avatar} size={30} />
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.9)" }}
          onClick={() => setLightbox(false)}
        >
          <img src={msg.imageUrl} alt="full" className="max-w-full max-h-full rounded-xl object-contain" />
        </div>
      )}
    </>
  );
}

export default function MessageList({ messages, currentUser }) {
  let lastDate = null;

  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg) => {
        const dateLabel = msg.timestamp ? formatDate(msg.timestamp) : null;
        const showDate = dateLabel && dateLabel !== lastDate;
        if (showDate) lastDate = dateLabel;

        if (msg.type === "system") {
          return (
            <div key={msg.id}>
              {showDate && (
                <div className="flex justify-center my-5">
                  <span className="text-xs px-4 py-2 rounded-full font-medium"
                    style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
                    {dateLabel}
                  </span>
                </div>
              )}
              <SystemMessage msg={msg} />
            </div>
          );
        }

        const isSelf = msg.sender?.id === currentUser?.id;

        return (
          <div key={msg.id}>
            {showDate && (
              <div className="flex justify-center my-5">
                <span className="text-xs px-4 py-2 rounded-full font-medium"
                  style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
                  {dateLabel}
                </span>
              </div>
            )}
            <div className={`flex ${isSelf ? "justify-end" : "justify-start"} px-1`}>
              {msg.type === "image" ? (
                <ImageBubble msg={msg} isSelf={isSelf} />
              ) : (
                <TextBubble msg={msg} isSelf={isSelf} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
