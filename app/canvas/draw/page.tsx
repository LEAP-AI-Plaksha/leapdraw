"use client";

import React, { useState, useEffect } from "react";
import Canvas, { exportCanvasAsImage, sendImageToWebSocket } from "../../components/CanvasComponent";
import { useRouter, useSearchParams } from "next/navigation";
import { useWebSocket } from "../../../contexts/WebSocketContext1";

export default function Home() {
  const socket = useWebSocket() as WebSocket;
  const searchParams = useSearchParams();
  const roomID = searchParams.get("roomID") as string;
  const promptIndex = searchParams.get("promptIndex");
  const [guess, setGuess] = useState(""); // State to store the guess input
  const [wrongGuessCount, setWrongGuessCount] = useState(0); // State to store wrong guesses
  const [prompt, setPromot] = useState("Butterfly");
  const [editor, setEditor] = useState<any>(null);

  useEffect(() => {
    if (!editor) return;

    const interval = setInterval(() => {
      sendImageToWebSocket(editor, socket, roomID).catch((err) =>
        console.error("Error sending image to WebSocket:", err)
      );
    }, 500); // Send every 0.5 seconds

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, [editor]); // Runs when the editor instance changes

  const handleExport = async () => {
    if (!editor) {
      console.error("Editor instance is not available");
      return;
    }
    await exportCanvasAsImage(editor);
  };

  // Function to handle guess submission
  const handleGuessSubmit = async () => {
    // Make an API call (placeholder for now)
    const isCorrect = false; // Replace with API response

    if (!isCorrect) {
      setWrongGuessCount((prevCount) => prevCount + 1); // Increment wrong guess count
    }
    setGuess(""); // Clear the input field
  };

  // Function to handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission or default behavior
      handleGuessSubmit();
    }
  };

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
            Prompt: &nbsp;{promptIndex} / 5
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
            <button
              onClick={handleExport}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium font-instrumentSans text-xl mt-4"
            >
              Export Canvas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
