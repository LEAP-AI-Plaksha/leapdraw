"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { initializeWebSocket2, getWebSocket2 } from "../utils/ws2";

const JoinRoomPage: React.FC = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    initializeWebSocket2();
    const ws = getWebSocket2();
    setSocket(ws);

    if (ws) {
      ws.onopen = () => {
        console.log("WebSocket2 connection opened");
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);

        // Check the response from the WebSocket
        if (response.status === "success") {
          console.log("Room joined successfully:", response);
          // Redirect to the guessing canvas
          router.push(`/canvas/guess?roomID=${roomId}&promptIndex=1`);
        } else if (response.status === "error") {
          setErrorMessage(response.message || "Failed to join room.");
          console.error("Failed to join room:", response.message);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setErrorMessage("WebSocket error. Please try again.");
      };

      // Clean up event listeners on component unmount
      return () => {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
      };
    } else {
      setErrorMessage("Failed to initialize WebSocket. Please try again.");
    }
  }, [router]);

  const handleJoinRoom = () => {
    if (!roomId) {
      setErrorMessage("Please enter a valid Room ID.");
      return;
    }

    if (!socket) {
      setErrorMessage("WebSocket connection not available. Please try again.");
      return;
    }

    const sendJoinRequest = () => {
      socket.send(JSON.stringify({ action: "joinRoom", roomId }));
    };

    if (socket.readyState === WebSocket.OPEN) {
      sendJoinRequest();
    } else if (socket.readyState === WebSocket.CONNECTING) {
      // Wait for the socket to open before sending the message
      socket.addEventListener("open", sendJoinRequest, { once: true });
    } else {
      setErrorMessage("WebSocket is not in a ready state. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: "#EA4A2E" }}
    >
      {/* Header */}
      <div className="absolute top-5 left-5 flex items-center space-x-2">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <img
              src="/backbutton.svg"
              alt="Back"
              className="w-12 h-12"
            />
            <span className="ml-2 text-white text-xl font-medium font-instrumentSans">
              leave
            </span>
          </div>
        </Link>
      </div>

      <div className="absolute top-5 right-5">
        <h1 className="text-4xl font-bold font-londrinaShadow flex-1 text-right">
          LEAP Quick-Draw
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-white">
        {/* Input for room ID to join */}
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-bold font-instrumentSans">Room ID:</h2>
          <input
            type="text"
            value={roomId}
            className="text-center w-64 h-12 bg-white text-black font-bold font-instrumentSans"
            onChange={(e) => {
              setRoomId(e.target.value);
              setErrorMessage(null); // Clear error message on input change
            }}
          />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-4 text-red-500 font-medium">{errorMessage}</div>
        )}

        {/* Button to join room */}
        <button
          onClick={handleJoinRoom}
          className="bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-lg font-medium font-instrumentSans text-xl mt-5"
        >
          Join Room
        </button>
      </div>

      {/* Image */}
      <div className="absolute bottom-0 right-0">
        <img
          src="/waitingroomimage.svg"
          alt="Waiting Room Illustration"
          className="w-64 h-64"
        />
      </div>
    </div>
  );
};

export default JoinRoomPage;
