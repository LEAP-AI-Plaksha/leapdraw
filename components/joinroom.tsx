"use client";

import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Header from "./header";

export default function JoinRoom({
  username,
  setUsername,
  handleCreateRoom,
  handleJoinRoom,
  handleLeaveRoom,
}: {
  username: string;
  setUsername: (username: string) => void;
  handleCreateRoom: () => void;
  handleJoinRoom: (roomId: number) => void;
  handleLeaveRoom: () => void;
}) {
  const [joinRoomId, setJoinRoomId] = useState<number | null>(null);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    // Save username in a cookie that expires in 7 days
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    document.cookie = `username=${value}; expires=${expirationDate.toUTCString()}; path=/`;
  };

  return (
    <div className="w-screen min-h-screen flex-1 from-black via-[#0F1C23] to-[#AB572B] bg-gradient-to-br flex flex-col p-4">
      <div>
        <Header centerElement={null} handleLeaveRoom={handleLeaveRoom} />
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
            onChange={handleUsernameChange}
            className="w-full text-lg bg-black text-gray-400 border-b-4 border-[#EA4A2E] outline-none focus:border-[#EA4A2E] placeholder-gray-500 text-center"
          />
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
              value={joinRoomId ?? ""}
              onChange={(e) => setJoinRoomId(parseInt(e.target.value) || null)}
              className="w-full text-lg bg-black text-gray-400 border-b-4 border-[#EA4A2E] outline-none focus:border-[#EA4A2E] placeholder-gray-500 text-center p-2"
            />
            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white text-lg h-12 w-full rounded-full font-bold"
              onClick={() => joinRoomId && handleJoinRoom(joinRoomId)}
            >
              Join
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
}
