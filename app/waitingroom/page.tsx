"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const WaitingRoomPage: React.FC = () => {
  const [roomId, setRoomId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Generate a random 4-digit room ID
    const generatedRoomId = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomId(generatedRoomId);

    // Establish WebSocket connection and send room ID
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      // Send the room creation message
      socket.send(JSON.stringify({ action: "createRoom", roomId: generatedRoomId }));
      console.log(JSON.stringify({ action: "createRoom", roomId: generatedRoomId }));
    };

    socket.onmessage = (event) => {
      // Parse the incoming message
      const message = JSON.parse(event.data);

      // Check if the message indicates that another player has joined
      if (message.status === "playerJoined") {
        console.log("Player 2 has joined the room");
        // Redirect to the drawing canvas with roomID and prompt
        router.push(`/canvas/draw?roomID=${generatedRoomId}&prompt=1`);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [router]);

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
        <h2 className="text-2xl font-bold">Room: {roomId}</h2>
        <div className="mt-8 text-center">
          <h1 className="text-4xl font-bold">Waiting for Player 2 😴</h1>
        </div>
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

export default WaitingRoomPage;
