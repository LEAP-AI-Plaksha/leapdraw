"use client";

import React from "react";
import Header from "../../components/Header";
import { Londrina_Shadow, Instrument_Sans } from "next/font/google";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWebSocket } from "../../contexts/webSocketContext";

const ins = Instrument_Sans({ subsets: ["latin"], weight: "700" });

const WaitingPage: React.FC = () => {
  const router = useRouter();
  const { socket, sendMessage, latestMessage } = useWebSocket();
  const [gameId, setGameId] = React.useState<string | undefined>();
  const [message, setMessage] = React.useState<string>("");

  const sendChat = () => {
    console.log(message);
    sendMessage({ type: "chat_send", message: message });
  };

  // const handleKeyDown = (event: KeyboardEvent) => {
  //   if (event.key === "Enter") {
  //     sendChat();
  //   }
  // };

  // window.addEventListener("keydown", handleKeyDown);

  return (
    <div className="h-screen w-screen from-[#0E1B22] via-[#0F1C23] to-[#AB572B] bg-gradient-to-br text-white flex flex-col">
      <Header centerElement={null} />
      <div className="flex flex-grow">
        {/* Drawing Canvas */}
        <div className="flex-1 flex justify-center items-center">
          <div className="w-[90%] h-[90%] bg-white shadow-lg rounded-lg relative">
            <div className="absolute bottom-4 left-4 flex space-x-2">
              <button className="p-2 bg-gray-800 rounded">✋</button>
              <button className="p-2 bg-gray-800 rounded">✏️</button>
              <button className="p-2 bg-gray-800 rounded">🧽</button>
            </div>
          </div>
        </div>

        {/* Sidebar containing Leaderboard & Chat */}
        <div className="w-1/4 flex flex-col items-center">
          {/* Leaderboard Section */}
          <div className="h-[70%] bg-[#EA4A2E] p-4 rounded-lg shadow-lg flex flex-col mt-8 w-full">
            <h2 className="text-2xl font-bold text-center mb-4">Leaderboard</h2>
            <div className="flex-grow space-y-2 overflow-y-auto">
              {["Player 1", "Player 2", "Player 3", "Player 4", "Player 5"].map(
                (player, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-black p-3 rounded-lg space-x-2"
                  >
                    <img
                      src="/avatar-placeholder.png"
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span
                          className={`${
                            index === 0
                              ? "text-purple-400"
                              : index === 1
                              ? "text-green-400"
                              : index === 2
                              ? "text-red-400"
                              : index === 3
                              ? "text-blue-400"
                              : "text-white"
                          } font-bold`}
                        >
                          {player}
                        </span>
                        <span className="text-gray-400 text-sm">
                          14:2{index + 3}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Chat Section */}

          <div className="h-[20%] bg-gray-900 p-3 rounded-lg shadow-lg flex flex-col w-full mt-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 bg-gray-800 h-full text-white outline-none rounded-l-lg"
              maxLength={250}
            />
            <button onClick={sendChat}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingPage;
