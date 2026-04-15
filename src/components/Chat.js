import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { getMessages } from "../servises/operations";

const socketUrl = (() => {
  try {
    return new URL(process.env.REACT_APP_API_URL || "http://localhost:5000").origin;
  } catch (error) {
    return "http://localhost:5000";
  }
})();

const Chat = ({ ledgerId, token }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const [currentUserId, setCurrentUserId] = useState(null);
  const scrollRef = useRef(null);

  const fallbackAvatar = "/mnt/data/3b3bb00d-cc95-4799-9b60-3db31cd94245.png";

  const getUserIdFromToken = (t) => {
    try {
      if (!t) return null;
      const parts = t.split('.');
      if (parts.length < 2) return null;
      let payload = parts[1];
      payload = payload.replace(/-/g, '+').replace(/_/g, '/');
      while (payload.length % 4) payload += '=';
      const decoded = JSON.parse(atob(payload));
      return decoded.id || decoded.user_id || decoded.sub || null;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const newSocket = io(socketUrl, {
      auth: { token },
      path: "/socket.io",
    });

    setSocket(newSocket);

    newSocket.emit("join_ledger", { ledger_id: ledgerId });

    newSocket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connect error:", error);
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => newSocket.close();
  }, [ledgerId, token]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await dispatch(getMessages(ledgerId));
        setMessages(data.messages || data || []);
      } catch (error) {
        console.error("Chat messages load error:", error);
      }
    };
    loadMessages();
  }, [ledgerId, dispatch]);

  useEffect(() => {
    setCurrentUserId(getUserIdFromToken(token));
  }, [token]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!socket || !message) return;
    socket.emit("send_message", {
      ledger_id: ledgerId,
      message,
    });
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full text-gray-200 ">
      {/* <div className="mb-2">
        <h2 className="text-lg font-bold">Ledger Chat</h2>
      </div> */}

      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div ref={scrollRef} className="flex-1 overflow-y-auto mb-2 space-y-3 pr-2 hide-scrollbar">
        {messages && messages.length > 0 ? (
          messages.map((msg, idx) => {
            // Resolve sender id/name/avatar from various possible message shapes
            const resolved = (() => {
              const id = msg.sender_id || (msg.sender && msg.sender.id) || (msg.user && msg.user.id) || (msg.from && msg.from.id) || (msg.sender_obj && msg.sender_obj.id) || msg.sender || null;

              let name = null;
              if (msg.sender_name) name = msg.sender_name;
              else if (msg.sender_username) name = msg.sender_username;
              else if (msg.sender && (msg.sender.name || msg.sender.username)) name = msg.sender.name || msg.sender.username;
              else if (msg.user && (msg.user.name || msg.user.username)) name = msg.user.name || msg.user.username;
              else if (msg.from && (msg.from.name || msg.from.username)) name = msg.from.name || msg.from.username;
              else if (typeof msg.sender === 'string') name = msg.sender;

              const avatar = msg.sender_avatar || msg.avatar || msg.profile_pic || (msg.sender && msg.sender.avatar) || (msg.user && msg.user.avatar) || fallbackAvatar;

              return { id, name, avatar };
            })();

            const senderId = resolved.id;
            const isOwn = currentUserId && senderId && String(senderId) === String(currentUserId);
            const name = resolved.name || (isOwn ? 'You' : 'User');
            const avatar = resolved.avatar || fallbackAvatar;

            return (
              <div
                key={msg.message_id || idx}
                className={`flex items-end ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                {!isOwn && (
                  <img src={avatar} alt={name} className="w-6 h-6 rounded-full mr-2" />
                )}

                <div className="max-w-[85%] md:max-w-[70%]">
                  <div className={`text-[11px] ${isOwn ? 'text-right' : 'text-left'} mb-1 truncate`}>
                    <span className="font-semibold text-gray-300">{name}</span>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-lg text-sm break-words whitespace-pre-wrap ${isOwn ? 'bg-red-600 text-white ml-2' : 'bg-gray-800 text-gray-200 mr-2'}`}
                  >
                    {msg.message || msg.text}
                  </div>
                </div>

                {isOwn && (
                  <img src={avatar} alt={name} className="w-6 h-6 rounded-full ml-2" />
                )}
              </div>
            );
          })
        ) : (
          <div className="text-sm text-gray-500">No messages yet.</div>
        )}
      </div>

      <div className="flex items-center gap-2 ">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 px-2 py-1 sm:px-3 sm:py-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 text-sm sm:text-base"
        />
        <button
          onClick={sendMessage}
          className="px-2 py-1 sm:px-3 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
