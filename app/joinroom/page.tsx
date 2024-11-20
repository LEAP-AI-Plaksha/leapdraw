"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const JoinRoomPage: React.FC = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleJoinRoom = () => {
    if (!roomId) {
      setErrorMessage("Please enter a valid Room ID.");
      return;
    }

    // Establish WebSocket connection
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("WebSocket connection opened");

      // Send the join room request with the room ID
      socket.send(JSON.stringify({ action: "joinRoom", roomId }));
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);

      // Check the response from the WebSocket
      if (response.status === "success") {
        console.log("Room joined successfully:", response);
        // Redirect to the guessing canvas
        router.push(`/canvas/guess?roomID=${roomId}&prompt=1`);
      } else {
        setErrorMessage(response.message || "Failed to join room.");
        console.error("Failed to join room:", response.message);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setErrorMessage("WebSocket error. Please try again.");
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
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
            <span className="ml-2 text-white text-xl font-medium font-instrumentSans">leave</span>
          </div>
        </Link>
      </div>

      <div className="absolute top-5 right-5">
        <h1 className="text-4xl font-bold font-londrinaShadow flex-1 text-right">LEAP Quick-Draw</h1>
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
