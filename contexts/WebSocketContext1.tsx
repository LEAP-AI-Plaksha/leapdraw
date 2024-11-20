// contexts/WebSocketContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    ws.onopen = () => console.log("WebSocket connection opened");
    ws.onclose = () => console.log("WebSocket connection closed");

    return () => {
      ws.close();
    };
  }, []);

  return <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => useContext(WebSocketContext);
