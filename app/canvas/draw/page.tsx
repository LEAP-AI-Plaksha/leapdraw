"use client";

import React, { useState, useEffect } from "react";
import Canvas, { sendImageToWebSocket } from "../../components/CanvasComponent";
import { useRouter, useSearchParams } from "next/navigation";
import { getWebSocket1 } from "../../utils/ws1";

export default function DrawPage() {
  const searchParams = useSearchParams();
  const roomID = searchParams.get("roomID") as string;
  const promptIndex = parseInt(searchParams.get("promptIndex") || "1", 10);
  const [editor, setEditor] = useState<any>(null);
  const socket = getWebSocket1() as WebSocket;
  const [aiGuess, setAiGuess] = useState("Nothing 😔");
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!socket) {
      console.error("WebSocket is not available");
      return;
    }

    const keepAliveInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ action: "ping" })); // Send a ping to keep the connection alive
      }
    }, 15000); // Ping every 15 seconds

    // Request the current prompt from the server
    socket.send(JSON.stringify({ action: "getPrompt", roomId: roomID }));

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.action === "prompt") {
        setPrompt(message.prompt);
      } else if (message.action === "aiGuess") {
        const { category, confidence } = message;
        console.log(`AI Guess: ${category} (Confidence: ${confidence})`);
        setAiGuess(`${category} (${(confidence * 100).toFixed(2)}%)`);
      } else if (message.action === "levelComplete") {
        const { winner, aiScore, humanScore } = message;
        alert(`Level Complete! Winner: ${winner}`);
        // Request to move to the next level
        socket.send(JSON.stringify({ action: "nextLevel", roomId: roomID }));
      } else if (message.action === "startLevel") {
        const newPromptIndex = message.level + 1; // Adjusted here
        // Reload the page with the next promptIndex
        router.push(`/canvas/draw?roomID=${roomID}&promptIndex=${newPromptIndex}`);
      } else if (message.action === "gameOver") {
        const { winner, aiScore, humanScore } = message;
        alert(`Game Over! Winner: ${winner}\nAI Score: ${aiScore}\nHuman Score: ${humanScore}`);
        // Redirect to waiting room or home page
        router.push("/waitingroom");
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.warn("WebSocket connection closed");
    };

    return () => {
      clearInterval(keepAliveInterval); // Clear the keep-alive interval
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
    };
  }, [socket, roomID, router]);

  useEffect(() => {
    if (!editor) return;

    const interval = setInterval(() => {
      sendImageToWebSocket(editor, socket, roomID).catch((err) =>
        console.error("Error sending image to WebSocket:", err)
      );
    }, 2000); // Send every 2 seconds

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, [editor, socket, roomID]);

  return (
    <div
      className="relative h-screen bg-cover bg-right bg-no-repeat flex items-start justify-start w-full"
      style={{ backgroundImage: "url('/gradbg.svg')" }}
    >
      <div className="relative z-5 flex flex-col items-center w-full h-full text-white pt-5">
        {/* Top Header */}
        <div className="flex justify-between items-center w-full px-8 py-4 bg-[#080F13]">
          <div className="flex-1"></div> {/* Empty div to push content to the center */}
          <h2 className="text-2xl font-semibold text-center font-instrumentSans">
            Prompt: &nbsp;{promptIndex} / 3
          </h2>
          <h1 className="text-4xl font-bold font-londrinaShadow flex-1 text-right">
            LEAP Quick-Draw
          </h1>
        </div>

        {/* Main Content */}
        <div className="flex w-[95%] h-full mb-5">
          {/* p5.js Canvas Area */}
          <div className="flex-1 m-4">
            <Canvas onEditorReady={setEditor} />
          </div>

          <div className="w-1/3 text-white m-4 flex flex-col items-center justify-center p-4">
            <h2 className="font-instrumentSans text-3xl">
              Please draw a {prompt}
            </h2>
            <h2>AI guessed: {aiGuess}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
