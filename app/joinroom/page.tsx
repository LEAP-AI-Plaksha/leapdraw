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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
      ws.onopen = () => console.log("WebSocket2 connection opened");
      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.status === "success") {
          router.push(`/canvas/guess?roomID=${response.roomId}&promptIndex=1`);
        } else {
          setErrorMessage(response.message || "Failed to join room.");
        }
      };
      ws.onerror = () => setErrorMessage("WebSocket error. Please try again.");
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
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      setErrorMessage("WebSocket is not ready. Please try again.");
      return;
    }
    socket.send(JSON.stringify({ action: "joinRoom", roomId }));
  };

  return (
    <div className="w-screen min-h-screen flex-1 bg-black flex  flex-col p-4 ">
      <div className="">
        <Header centerElement={null} />
      </div>

      {/* Avatar Carousel */}
      <div className="flex justify-center items-center mt-16">
        <Carousel className="w-52 h-40 md:w-72 md:h-72 lg:w-100 lg:h-80">
          <CarouselContent>
            {Array.from({ length: 10 }).map((_, index) => (
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
          <CarouselPrevious className="bg-[#EA4A2E] h-10 w-10 sm:h-12 sm:w-6 lg:h-14 lg:w-14 " />
          <CarouselNext className="bg-[#EA4A2E] h-10 w-10 sm:h-12 sm:w-6 lg:h-14 lg:w-14" />
        </Carousel>
      </div>

      {/* Input Field */}
      <div className="w-full flex justify-center mt-16">
        <input
          type="text"
          placeholder="Enter your name..."
          className="w-full max-w-xs text-lg bg-black text-gray-400 border-b-4 border-[#EA4A2E] outline-none focus:border-[#EA4A2E] placeholder-gray-500 text-center"
        />
      </div>

      {/* Buttons */}
      <div className="w-full flex flex-col sm:flex-row gap-4 mt-12 justify-center items-center">
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-red-500 hover:bg-red-600 text-white text-[24px] h-12 w-48 rounded-[15px] font-bold">
              Join Room
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Room ID</DialogTitle>
            </DialogHeader>
            <input
              type="text"
              placeholder="Enter Room ID..."
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full text-lg bg-black text-gray-400 border-b-4 border-[#EA4A2E] outline-none focus:border-[#EA4A2E] placeholder-gray-500 text-center"
            />
            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white text-lg h-12 w-full rounded-full font-bold"
              onClick={handleJoinRoom}
            >
              Confirm & Join
            </button>
          </DialogContent>
        </Dialog>
        <Link href="/assignment">
          <button className="bg-red-500 hover:bg-red-600 text-white text-[24px] h-12 w-48 rounded-[15px] font-bold">
            New Room
          </button>
        </Link>
      </div>
    </div>
  );
};

export default JoinRoomPage;
