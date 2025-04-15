"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface latestMessageType {
  type: string;
  players?: string[];
  room_id?: number;
  is_host?: boolean;
  max_rounds?: number;
  round?: number;
  username?: string;
  remaining?: number;
  round_set?: number;
  time?: number;
  prompt?: string;
  drawer?: string;
  final_scores?: { [key: string]: number };
  points?: number;
  correct_answer?: string;
  image?: string;
  message?: string;
  game_started?: boolean;
}

interface WebSocketContextType {
  socket: WebSocket | null;
  latestMessage: latestMessageType | null;
  sendMessage: (message: object) => void;
  isSocketReady: () => boolean;
  ackedLatestMessage: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [latestMessage, setLatestMessage] = useState<latestMessageType | null>(
    null
  );

  useEffect(() => {
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8080"
    );
    setSocket(ws);

    ws.onopen = () => console.log("✅ WebSocket connection established.");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // console.log("⬇️ Message received raw:", data);
        setLatestMessage(data); // Store the latest received message
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => console.log("⛔ WebSocket connection closed.");

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (message: object) => {
    console.log(message);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn("⚠️ WebSocket is not connected.");
    }
  };

  const isSocketReady = () => {
    if (!socket) return false;
    return socket.readyState === WebSocket.OPEN;
  };

  const ackedLatestMessage = () => {
    if (latestMessage) {
      setLatestMessage(null); // Clear the latest message after acknowledging
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        latestMessage,
        ackedLatestMessage,
        sendMessage,
        isSocketReady,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
