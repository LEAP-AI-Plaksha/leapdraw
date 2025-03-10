"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { initializeWebSocket2, getWebSocket2 } from "../utils/ws2";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Header from "../components/Header";

const JoinRoomPage: React.FC = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  var savedRoomId;
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
          // print()
          router.push(`/canvas/guess?roomID=${response.roomId}&promptIndex=1`);
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
    savedRoomId = roomId;
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
    <div className="w-full min-h-screen bg-black h-screen">
      {/*Layer 1*/}
     <Header/>

      {/*Avatar*/}
      <div className="flex justify-center items-center h-[60%]">
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {Array.from({ length: 15 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <img
                    src="/avatar.svg"
                    alt={`Avatar ${index + 2}`}
                    className="border"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-[#EA4A2E] h-16 w-16 just" />
          <CarouselNext className="bg-[#EA4A2E]" />
        </Carousel>
      </div>
      {/*Name*/}
      <div></div>
      {/*Buttons */}
    </div>
  );
};

export default JoinRoomPage;
