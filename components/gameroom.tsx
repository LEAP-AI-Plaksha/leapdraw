"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Header from "./header";
import Image from "next/image";
import {
  TLComponents,
  Tldraw,
  DefaultToolbar,
  ToolbarItemProps,
  useTools,
  useIsToolSelected,
  TldrawUiMenuToolItem,
  Editor,
  exportToBlob,
  getSnapshot,
} from "tldraw";
import "tldraw/tldraw.css";

interface GameRoomProps {
  roomId: number;
  username: string;
  isHost: boolean;
  drawer: string;
  isDrawer: boolean;
  drawerPrompt: string;
  timeRemaining: number;
  round: number;
  roundSet: number;
  maxRounds: number;
  players: string[];
  isStarted: boolean;
  isGameOver: boolean;
  chatMessages: Array<{ username: string; time: Date; message: string }>;
  leaderboard: Record<string, number>;
  handleNewChatMessage: (message: string) => void;
  handleLeaveRoom: () => void;
  sendMessage: (message: object) => void;
  canvasImageData: string;
  setCanvasImageData: (data: string) => void;
}

export default function GameRoom({
  roomId,
  username,
  isHost,
  drawer,
  isDrawer,
  drawerPrompt,
  timeRemaining,
  round,
  roundSet,
  maxRounds,
  players,
  chatMessages,
  leaderboard,
  isGameOver,
  handleNewChatMessage,
  handleLeaveRoom,
  sendMessage,
  canvasImageData,
  setCanvasImageData,
}: GameRoomProps) {
  const [bubbleColors] = useState(() => [
    "border-[#11AC7B]",
    "border-[#9839B1]",
    "border-[#337DFF]",
    "border-[#EC5E46]",
  ]);
  const [chatMsg, setChatMsg] = useState<string>("");
  const [showLeaderboard, setShowLeaderboard] = useState(false); // If false show chat, if true show leaderboard
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    if (containerRef.current && chatMessages.length > 0 && !showLeaderboard) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chatMessages, showLeaderboard]);

  function ToolbarItem({ tool }: ToolbarItemProps) {
    const tools = useTools();
    const isSelected = useIsToolSelected(tools[tool]);
    return <TldrawUiMenuToolItem toolId={tool} isSelected={isSelected} />;
  }

  const CustomToolbar = () => (
    <DefaultToolbar>
      <ToolbarItem tool="draw" />
      <ToolbarItem tool="eraser" />
    </DefaultToolbar>
  );

  const components: TLComponents = {
    StylePanel: () => <div></div>,
    QuickActions: () => <div></div>,
    ActionsMenu: () => <div></div>,
    PageMenu: () => <div></div>,
    MainMenu: () => <div></div>,
    NavigationPanel: () => <div></div>,
    Toolbar: CustomToolbar,
    SharePanel: () => <div></div>,
  };

  const exportCanvasAsImage = async () => {
    if (!editorRef.current) throw new Error("Editor instance is required");

    const shapeIds = editorRef.current.getCurrentPageShapeIds();

    // If the canvas is empty, export a blank image
    if (shapeIds.size === 0) {
      // console.warn("Canvas is empty. Exporting a blank image.");
      const blankCanvas = document.createElement("canvas");
      blankCanvas.width = 200; // Set desired width for blank image
      blankCanvas.height = 200; // Set desired height for blank image
      const ctx = blankCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#FFFFFF"; // Set background color
        ctx.fillRect(0, 0, blankCanvas.width, blankCanvas.height);
      }

      return new Promise<string>((resolve, reject) => {
        blankCanvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Failed to create blank image blob"));
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob); // Convert blob to base64
        }, "image/png");
      });
    }

    const blob = await exportToBlob({
      editor: editorRef.current,
      ids: [...shapeIds],
      format: "png",
      opts: { background: true },
    });

    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Converts the blob to a base64 data URL
    });
  };

  const exportCanvasAsStrokes = async () => {
    if (!editorRef.current) throw new Error("Editor instance is required");
    const snapshot = getSnapshot(editorRef.current.store);
    return snapshot.document.store;
  };

  const clearCanvas = () => {
    if (!editorRef.current) throw new Error("Editor instance is required");
    const shapeIds = editorRef.current.getCurrentPageShapeIds();

    if (shapeIds.size === 0) {
      // console.warn("Canvas is already empty.");
      return;
    }

    editorRef.current.deleteShapes([...shapeIds]);
    // console.log("Canvas cleared successfully.");
  };

  useEffect(() => {
    if (!editorRef.current) return;
    clearCanvas();
  }, [round]);

  const sendImageToWebSocket = useCallback(async () => {
    if (!editorRef.current) throw new Error("Editor instance is required");

    try {
      const imageBase64 = await exportCanvasAsImage();
      if (!imageBase64) {
        // console.warn("No image to send. Canvas might be empty.");
        return; // Exit early if no image is exported
      }

      const imageData = await exportCanvasAsStrokes();

      const data = {
        type: "draw_send",
        data: { store: imageData },
        image: imageBase64,
        room_id: roomId,
        username: username,
      };

      sendMessage(data);
    } catch (error) {
      console.error("Error sending image to WebSocket:", error);
    }
  }, [roomId, username, sendMessage]);

  useEffect(() => {
    if (!editorRef.current) return;
    if (!isDrawer) return;
    if (timeRemaining <= 1) return;

    sendImageToWebSocket();
  }, [sendImageToWebSocket, isDrawer, timeRemaining]);

  return (
    <div className="h-screen w-screen from-black via-[#0F1C23] to-[#AB572B] bg-gradient-to-br text-white flex flex-col">
      <div className="pt-2 md:max-h-[10%]">
        <Header
          centerElement={
            <div className="flex flex-col items-center">
              <h1 className="text-4xl text-white font-bold font-instrumentSans text-center flex flex-row justify-between">
                {Math.floor(timeRemaining / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(timeRemaining % 60).toString().padStart(2, "0")}
              </h1>
              <h3 className="text-md">Room ID: {roomId}</h3>
            </div>
          }
          handleLeaveRoom={handleLeaveRoom}
        />
      </div>

      <div className="flex flex-col md:flex-row p-4 gap-4 h-full md:h-[90%] w-full">
        <div className="bg-white w-full h-full md:w-3/4 text-center">
          {isDrawer ? (
            <Tldraw
              components={components}
              cameraOptions={{ isLocked: true }}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
            />
          ) : isGameOver ? (
            <div className="flex items-center justify-center h-full w-full">
              <p className="text-black font-bold text-4xl">Game Ended!</p>
            </div>
          ) : canvasImageData ? (
            <Image
              src={canvasImageData}
              alt="Canvas Drawing"
              width={2000}
              height={2000}
              className="w-full h-full object-contain"
            />
          ) : (
            <p className="text-xl">Waiting for drawing...</p>
          )}
        </div>
        <div className="bg-[#ea4a2e] h-full w-full md:w-1/4 p-4 flex flex-col">
          <div className="flex flex-col justify-between items-center font-bold text-2xl mb-2">
            {isGameOver ? (
              <p className="text-black underline">Game Ended</p>
            ) : (
              <div>
                <p className="text-black underline">
                  Round {roundSet} (Max: {maxRounds})
                </p>
                <p className="text-lg">Drawer: {drawer}</p>
                {drawerPrompt && (
                  <p className="text-lg">Prompt: {drawerPrompt}</p>
                )}
              </div>
            )}
          </div>
          <h2 className="text-lg mb-4 text-center text-black flex flex-col md:flex-row justify-between">
            <button
              className={
                "border rounded-full px-4 py-2 " +
                (showLeaderboard
                  ? "hover:cursor-not-allowed bg-gray-400/80 font-bold"
                  : "hover:cursor-pointer")
              }
              onClick={() => setShowLeaderboard(true)}
              disabled={showLeaderboard}
            >
              Leaderboard
            </button>
            <button
              className={
                "border rounded-full px-4 py-2" +
                (!showLeaderboard
                  ? "hover:cursor-not-allowed bg-gray-400/80 font-bold"
                  : "hover:cursor-pointer")
              }
              onClick={() => setShowLeaderboard(false)}
              disabled={!showLeaderboard}
            >
              Chat Room
            </button>
          </h2>
          <div className="space-y-2 overflow-y-auto h-full" ref={containerRef}>
            {showLeaderboard ? (
              Object.entries(leaderboard)
                .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
                .map(([player, score]) => (
                  <div
                    key={player}
                    className="flex justify-between items-center bg-black p-3 rounded-lg"
                  >
                    <div className="flex flex-row items-center space-x-4">
                      <Image
                        src={`/froggy/froggy${
                          players.findIndex((p) => p === player) + 1
                        }.png`}
                        alt="Froggy Avatar"
                        width={60}
                        height={60}
                        className={
                          "object-cover rounded-full border-2 " +
                          bubbleColors[
                            players.findIndex((p) => p === player) %
                              bubbleColors.length
                          ]
                        }
                      />
                      <p className="font-bold">{player}</p>
                    </div>
                    <span className="font-bold pr-4">{score}</span>
                  </div>
                ))
            ) : (
              <div className="flex flex-col h-full space-y-4">
                <div className="h-5/6">
                  <div className="overflow-y-auto h-full">
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className="flex items-center mb-2 p-2 rounded-lg text-white bg-black"
                      >
                        <Image
                          src={`/froggy/froggy${
                            players.findIndex((p) => p === msg.username) + 1
                          }.png`}
                          alt="Froggy Avatar"
                          width={40}
                          height={40}
                          className={
                            "object-cover rounded-full border-2 " +
                            bubbleColors[
                              players.findIndex((p) => p === msg.username) %
                                bubbleColors.length
                            ]
                          }
                        />
                        <div className="flex flex-col w-full">
                          <div className="flex flex-row justify-between w-full items-center">
                            <span className="ml-2 font-bold text-left">
                              {msg.username}
                            </span>
                            <span className="mr-2 text-right text-gray-400 text-xs">
                              {new Date(msg.time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <span className="ml-2">{msg.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-1/6 flex flex-row space-x-2">
                  <input
                    type="text"
                    value={chatMsg}
                    onChange={(e) => setChatMsg(e.target.value)}
                    className="w-full p-2 rounded-lg text-black"
                    placeholder="Type your message..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && chatMsg.trim() !== "") {
                        handleNewChatMessage(chatMsg);
                        setChatMsg("");
                      }
                    }}
                  />
                  <div className="flex flex-row py-3">
                    <button
                      className="bg-white text-black rounded px-2"
                      onClick={() => {
                        if (chatMsg.trim() !== "") {
                          handleNewChatMessage(chatMsg);
                          setChatMsg("");
                        }
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
