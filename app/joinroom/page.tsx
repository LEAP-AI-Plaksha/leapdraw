"use client";
import React, { useState, useEffect } from "react";
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
import { useWebSocket } from "../contexts/webSocketContext";
import { useRouter } from "next/navigation";

const JoinRoomPage: React.FC = () => {
  const { socket, sendMessage, latestMessage } = useWebSocket();
  const [roomId, setRoomId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isHost, setIsHost] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [round, setRound] = useState<number>(0);
  const [players, setPlayers] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (latestMessage) {
      console.log("Message received:", latestMessage);

      if (latestMessage.type === "room_created") {
        const roomId = latestMessage.room_id;
        console.log(`Room created with ID: ${roomId}`);

        sendMessage({
          type: "join_room",
          room_id: roomId,
          username: username || "TestUser1",
        });

        console.log(`Joining room: ${roomId} as ${username || "TestUser1"}`);

        // ✅ Navigate to waiting area
        router.push(`/waitingarea/${roomId}`);
      } else if (latestMessage.type === "room_joined") {
        const roomId = latestMessage.room_id;
        router.push(`/waitingarea/${roomId}`);
      }
    }
  }, [latestMessage, sendMessage, username, router, roomId]);

  const handleCreateRoom = () => {
    sendMessage({
      type: "create_room",
    });
  };

  const handleJoinRoom = (roomId: number, username: string) => {
    sendMessage({
      type: "join_room",
      room_id: roomId,
      username: username,
    });
  };

  const handleSubmitName = () => {
    if (username.trim() !== "") {
      console.log(`Name submitted: ${username}`);
    }
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

      {/* Input Field with Submit Button */}
      <div className="w-full flex justify-center mt-16">
        <div className="flex w-full max-w-xs">
          <input
            type="text"
            placeholder="Enter your name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full text-lg bg-black text-gray-400 border-b-4 border-[#EA4A2E] outline-none focus:border-[#EA4A2E] placeholder-gray-500 text-center"
          />
          <button
            onClick={handleSubmitName}
            className="ml-2 bg-[#EA4A2E] text-white px-4 rounded-md hover:bg-red-600 text-sm font-bold"
          >
            Submit
          </button>
        </div>
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
              value={roomId ?? ""}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full text-lg bg-black text-gray-400 border-b-4 border-[#EA4A2E] outline-none focus:border-[#EA4A2E] placeholder-gray-500 text-center"
            />
            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white text-lg h-12 w-full rounded-full font-bold"
              onClick={() =>
                roomId && handleJoinRoom(parseInt(roomId), username)
              }
            >
              Confirm & Join
            </button>{" "}
          </DialogContent>
        </Dialog>
        <button
          className="bg-red-500 hover:bg-red-600 text-white text-[24px] h-12 w-48 rounded-[15px] font-bold"
          onClick={handleCreateRoom}
        >
          New Room
        </button>
      </div>
    </div>
  );
};

export default JoinRoomPage;
