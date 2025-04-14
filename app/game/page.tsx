"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/lib/contexts/webSocketContext";
import WaitingRoom from "@/components/waitingroom";
import JoinRoom from "@/components/joinroom";
import GameRoom from "@/components/gameroom";
import { toast } from "sonner";

export default function GamePage() {
  const {
    socket,
    latestMessage,
    ackedLatestMessage,
    sendMessage,
    isSocketReady,
  } = useWebSocket();
  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<number | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [round, setRound] = useState<number>(0);
  const [roundSet, setRoundSet] = useState<number>(0);
  const [maxRounds, setMaxRounds] = useState<number>(0);
  // [
  //   "AI",
  //   "niksh",
  //   "niksh2",
  //   "niksh3",
  //   "niksh4",
  //   "niksh5",
  //   "niksh6",
  //   "niksh7",
  //   "niksh8",
  //   "niksh9",
  // ]
  const [players, setPlayers] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [drawer, setDrawer] = useState<string>("");
  const [isDrawer, setIsDrawer] = useState<boolean>(false);
  const [drawerPrompt, setDrawerPrompt] = useState<string>("");
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ username: string; time: Date; message: string }>
  >([]);
  const [leaderboard, setLeaderboard] = useState<Record<string, number>>({});
  const [canvasImageData, setCanvasImageData] = useState<string>("");
  const sentJoinRoomOnNewRoomRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    // Load username from cookie on mount
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "username") {
        setUsername(decodeURIComponent(value));
        break;
      }
    }
  }, []);

  useEffect(() => {
    if (latestMessage) {
      console.log("Message received:", latestMessage);
      const msg = latestMessage;
      ackedLatestMessage();
      const type = msg.type;

      if (type === "player_list_update") {
        setPlayers(msg.players);
      } else if (type === "room_created") {
        setRoomId(parseInt(msg.room_id));

        if (!sentJoinRoomOnNewRoomRef.current) {
          sentJoinRoomOnNewRoomRef.current = true;
          sendMessage({
            type: "join_room",
            room_id: msg.room_id,
            username: username,
          });
        }
        setIsHost(true);
        toast.success("Room created successfully!");
      } else if (type === "room_joined") {
        setIsHost(msg.is_host);
        setMaxRounds(msg.max_rounds - 1);
        setRound(msg.round - 1);
        setPlayers(msg.players);
        setIsStarted(msg.game_started);
        setRoomId(parseInt(msg.room_id));
      } else if (type === "player_joined") {
        if (!players.includes(msg.username)) {
          setPlayers((prevPlayers) => [...prevPlayers, msg.username]);
          if (msg.username !== username) {
            toast.success(
              `${
                msg.username.length > 10
                  ? `${msg.username.slice(0, 7)}...`
                  : msg.username
              } joined the room!`
            );
          }
        }
      } else if (type === "player_left") {
        setPlayers((prevPlayers) =>
          prevPlayers!.filter((player) => player !== msg.username)
        );
        toast.error(
          `${
            msg.username.length > 10
              ? `${msg.username.slice(0, 7)}...`
              : msg.username
          } left the room!`
        );
      } else if (type === "new_host") {
        if (username === msg.username) {
          setIsHost(true);
          toast.success("You are now the host!");
        }
      } else if (type === "timer_update") {
        setTimeRemaining(msg.remaining);
      } else if (type === "game_started") {
        setIsStarted(true);
        setMaxRounds(msg.max_rounds);
        toast.success("Game started!");
      } else if (type === "new_round") {
        setCanvasImageData("");
        setIsStarted(true);
        setRound(msg.round - 1);
        setRoundSet(msg.round_set - 1);
        setDrawer(msg.drawer);
        if (msg.drawer === username) setDrawerPrompt(msg.prompt);
        else setDrawerPrompt("");
        setTimeRemaining(msg.time);
      } else if (type === "chat_message") {
        const newMessage = {
          username: msg.username,
          time: new Date(),
          message: msg.message,
        };
        setChatMessages((prevMessages) => {
          return [...prevMessages, newMessage].slice(-20);
        });
      } else if (type === "game_ended") {
        setCanvasImageData("");
        setIsGameOver(true);
        setLeaderboard(msg.final_scores);
        setDrawer("");
        setDrawerPrompt("");
        setTimeRemaining(0);
      } else if (type === "correct_guess" || type === "drawer_points") {
        setLeaderboard((prevLeaderboard) => ({
          ...prevLeaderboard,
          [msg.username]: (prevLeaderboard[msg.username] || 0) + msg.points,
        }));
      } else if (type === "round_ended") {
        setTimeRemaining(0);
        toast.success(
          `Round ended! Correct answer was: ${msg.correct_answer}.`
        );
      } else if (type === "draw_update") {
        setCanvasImageData(msg.image);
      } else if (type === "clear_canvas") {
      } else if (type === "game_restarted") {
      } else if (type === "room_left") {
        toast.success("You have left the room.");
      } else if (type === "drawer_left") {
        // Do nothing -> Handled by player_left and new_round events
      } else if (type === "leaderboard_update") {
      } else if (type === "error") {
        // console.error("Error:", msg.message);
        toast.error(msg.message);
      }
    }
  }, [
    latestMessage,
    roomId,
    username,
    sendMessage,
    players,
    ackedLatestMessage,
  ]);

  useEffect(() => {
    if (!username || !drawer) setIsDrawer(false);
    setIsDrawer(drawer === username);
  }, [drawer, username]);

  useEffect(() => {
    if (!players) return;

    setLeaderboard((prevLeaderboard) => {
      const existingPlayers = Object.keys(prevLeaderboard);
      const newPlayers = players.filter(
        (player) => !existingPlayers.includes(player)
      );

      if (newPlayers.length === 0) return prevLeaderboard;

      const updatedLeaderboard = { ...prevLeaderboard };
      newPlayers.forEach((player) => {
        updatedLeaderboard[player] = 0;
      });

      return updatedLeaderboard;
    });
  }, [players]);

  const handleLeaveRoom = () => {
    setRoomId(null);
    setIsHost(false);
    setIsStarted(false);
    setMaxRounds(0);
    setRound(0);
    setPlayers([]);
    socket?.close();
    router.push("/");
  };

  const handleCreateRoom = () => {
    if (!username) {
      toast.error("Please enter a username.");
      return;
    }
    if (username.length > 10) {
      toast.error("Username must be less than 10 characters.");
      return;
    }
    if (username.length < 3) {
      toast.error("Username must be at least 3 characters.");
      return;
    }
    if (!socket) {
      toast.error("Socket is not connected. Please refresh the page.");
      return;
    }
    if (!isSocketReady) {
      toast.error("Socket is not ready. Please refresh the page.");
      return;
    }
    if (username.toLowerCase() === "ai") {
      toast.error("Username cannot be 'AI'.");
      return;
    }

    sendMessage({
      type: "create_room",
    });
  };

  const handleJoinRoom = (roomId: number) => {
    if (!username) {
      toast.error("Please enter a username.");
      return;
    }
    if (username.length > 10) {
      toast.error("Username must be less than 10 characters.");
      return;
    }
    if (username.length < 3) {
      toast.error("Username must be at least 3 characters.");
      return;
    }
    if (!socket) {
      toast.error("Socket is not connected. Please refresh the page.");
      return;
    }
    if (!isSocketReady) {
      toast.error("Socket is not ready. Please refresh the page.");
      return;
    }
    if (username.toLowerCase() === "ai") {
      toast.error("Username cannot be 'AI'.");
      return;
    }
    if (!roomId) {
      toast.error("Please enter a room ID.");
      return;
    }
    if (typeof roomId === "string") roomId = parseInt(roomId, 10);
    if (typeof roomId !== "number") {
      toast.error("Room ID must be a number.");
      return;
    }
    if (isNaN(roomId)) {
      toast.error("Room ID must be a number.");
      return;
    }
    if (roomId < 100000 || roomId > 999999) {
      toast.error("Room ID must be a 6-digit number.");
      return;
    }
    if (
      players
        .map((player) => player.toLowerCase())
        .includes(username.toLowerCase())
    ) {
      toast.error("A player with that name already exists in the room.");
      return;
    }

    sendMessage({
      type: "join_room",
      room_id: roomId,
      username: username,
    });
  };

  const handleStartGame = () => {
    if (!socket) {
      toast.error("Socket is not connected. Please refresh the page.");
      return;
    }
    if (!isSocketReady) {
      toast.error("Socket is not ready. Please refresh the page.");
      return;
    }

    // toast("Game started!");
    sendMessage({
      type: "start_game_request",
      username: username,
    });
  };

  if (!roomId) {
    return (
      <JoinRoom
        username={username}
        setUsername={setUsername}
        handleCreateRoom={handleCreateRoom}
        handleJoinRoom={handleJoinRoom}
        handleLeaveRoom={handleLeaveRoom}
      />
    );
  }

  const handleNewChatMessage = (message: string) => {
    if (!socket) {
      toast.error("Socket is not connected. Please refresh the page.");
      return;
    }
    if (!isSocketReady) {
      toast.error("Socket is not ready. Please refresh the page.");
      return;
    }
    if (message.length > 200) {
      toast.error("Message must be less than 200 characters.");
      return;
    }
    if (message.length < 1) {
      toast.error("Message must be at least 1 character.");
      return;
    }

    sendMessage({
      type: "chat_send",
      room_id: roomId,
      username: username,
      message: message,
    });
  };

  return isStarted ? (
    <GameRoom
      roomId={roomId}
      username={username}
      isHost={isHost}
      drawer={drawer}
      isDrawer={isDrawer}
      drawerPrompt={drawerPrompt}
      timeRemaining={timeRemaining}
      round={round}
      roundSet={roundSet}
      maxRounds={maxRounds}
      players={players}
      chatMessages={chatMessages}
      leaderboard={leaderboard}
      isStarted={isStarted}
      handleLeaveRoom={handleLeaveRoom}
      handleNewChatMessage={handleNewChatMessage}
      sendMessage={sendMessage}
      canvasImageData={canvasImageData}
      setCanvasImageData={setCanvasImageData}
      isGameOver={isGameOver}
    />
  ) : (
    <WaitingRoom
      players={players!.filter((player) => player !== "AI")}
      isHost={isHost}
      roomId={roomId}
      handleLeaveRoom={handleLeaveRoom}
      handleStartGame={handleStartGame}
    />
  );
}
