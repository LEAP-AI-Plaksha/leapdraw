"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Input} from "@/components/ui/input";

export default function WebSocketTest() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.addEventListener("open", () => {
      console.log("✅ Connection established");
    });

    ws.addEventListener("message", (event) => {
      console.log("📩 Raw message from server:", event.data); // Debugging

      try {
        const receivedData = JSON.parse(event.data).message;
        console.log(receivedData,"this is the received data")
        console.log("📩 Parsed message:", receivedData);

        if (receivedData) {
          setMessages((prev) => [...prev, receivedData]);
        } else {
          console.warn("⚠️ Unexpected message format:", receivedData);
        }
      } catch (error) {
        console.error("❌ Error parsing JSON:", error, event.data);
      }
    });

    ws.addEventListener("close", () => {
      console.log("❌ WebSocket connection closed");
    });

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("❌ WebSocket not connected yet!");
      return;
    }

    if (message.trim() !== "") {
      socket.send(JSON.stringify({ content: message }));
      setMessage(""); // Clear input after sending
    }
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <h1 className="text-2xl font-bold">WebSocket Test</h1>
      <div className="flex space-x-2 w-full max-w-md">
        <Input
          placeholder="Enter a message..."
          className="flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
      <Card className="w-full max-w-md p-4">
        <CardContent className="space-y-2">
          <h2 className="text-lg font-semibold">Messages</h2>
          {messages.length > 0 ? (
            <ul className="space-y-1">
              {messages.map((msg, index) => (
                <li key={index} className="p-2 bg-gray-100 rounded">
                  {msg}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No messages yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
