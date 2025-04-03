"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface WebSocketContextType {
  socket: WebSocket | null;
  latestMessage: any; // Store the latest received message
  sendMessage: (message: object) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [latestMessage, setLatestMessage] = useState<any>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    setSocket(ws);

    ws.onopen = () => console.log("✅WebSocket connection established.");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(" Message received:", data);
        setLatestMessage(data); // Store the latest received message
      } catch (error) {
        console.error(" Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => console.log("WebSocket connection closed.");

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

  return (
    <WebSocketContext.Provider value={{ socket, latestMessage, sendMessage }}>
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
