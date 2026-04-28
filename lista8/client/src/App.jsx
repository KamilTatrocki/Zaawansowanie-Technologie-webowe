import { useState, useEffect, useCallback, useRef } from "react";
import socket from "./socket";
import LoginScreen from "./components/LoginScreen";
import Sidebar from "./components/Sidebar";
import ChatRoom from "./components/ChatRoom";

export default function App() {
  const [phase, setPhase] = useState("login"); // "login" | "chat"
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]); // for current room
  const [members, setMembers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  // Refs for stable callbacks
  const currentRoomRef = useRef(null);
  currentRoomRef.current = currentRoom;

  // ── Socket lifecycle ──────────────────────────────────────────────────────
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ── Global socket listeners ───────────────────────────────────────────────
  useEffect(() => {
    // Rooms list updated
    socket.on("rooms:update", (updatedRooms) => {
      setRooms(updatedRooms);
    });

    // New message in current room
    socket.on("message:new", (msg) => {
      if (msg.roomId === currentRoomRef.current?.id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // Members of current room updated
    socket.on("room:members", (updatedMembers) => {
      setMembers(updatedMembers);
    });

    // Typing users updated
    socket.on("typing:update", (users) => {
      setTypingUsers(users);
    });

    return () => {
      socket.off("rooms:update");
      socket.off("message:new");
      socket.off("room:members");
      socket.off("typing:update");
    };
  }, []); // intentionally empty – uses ref for currentRoom

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleLogin = useCallback((nickname, avatar) => {
    setLoginLoading(true);
    setLoginError("");
    socket.emit("user:join", { nickname, avatar }, (res) => {
      setLoginLoading(false);
      if (res.error) {
        setLoginError(res.error);
        return;
      }
      setCurrentUser(res.user);
      setRooms(res.rooms);
      setPhase("chat");
    });
  }, []);

  const handleJoinRoom = useCallback((roomId) => {
    socket.emit("room:join", roomId, (res) => {
      if (res.error) { console.error(res.error); return; }
      setCurrentRoom(res.room);
      setMessages(res.room.messages);
      setMembers(res.members);
      setTypingUsers([]);
    });
  }, []);

  const handleLeaveRoom = useCallback((roomId) => {
    socket.emit("room:leave", roomId, () => {
      setCurrentRoom(null);
      setMessages([]);
      setMembers([]);
      setTypingUsers([]);
    });
  }, []);

  const handleSendMessage = useCallback((text, imageUrl) => {
    if (!currentRoomRef.current) return;
    socket.emit("message:send", {
      roomId: currentRoomRef.current.id,
      text,
      imageUrl,
    });
  }, []);

  const handleTypingStart = useCallback(() => {
    if (!currentRoomRef.current) return;
    socket.emit("typing:start", currentRoomRef.current.id);
  }, []);

  const handleTypingStop = useCallback(() => {
    if (!currentRoomRef.current) return;
    socket.emit("typing:stop", currentRoomRef.current.id);
  }, []);

  const handleCreateRoom = useCallback((name, description, callback) => {
    socket.emit("room:create", { name, description }, (res) => {
      callback(res);
      if (res.success) handleJoinRoom(res.room.id);
    });
  }, [handleJoinRoom]);

  // ── Render ─────────────────────────────────────────────────────────────────
  if (phase === "login") {
    return (
      <LoginScreen
        onJoin={handleLogin}
        error={loginError}
        loading={loginLoading}
      />
    );
  }

  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar
        currentUser={currentUser}
        rooms={rooms}
        currentRoom={currentRoom}
        members={members}
        onJoinRoom={handleJoinRoom}
        onLeaveRoom={handleLeaveRoom}
        onCreateRoom={handleCreateRoom}
      />
      <ChatRoom
        room={currentRoom}
        messages={messages}
        typingUsers={typingUsers}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
      />
    </div>
  );
}
