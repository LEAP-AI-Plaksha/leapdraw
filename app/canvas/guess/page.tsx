"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getWebSocket2 } from "../../utils/ws2";
import Image from "next/image";
export default function GuessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomID = searchParams.get("roomID");
  const promptIndex = parseInt(searchParams.get("promptIndex") || "1", 10);
  const [guess, setGuess] = useState(""); // State to store the guess input
  const [wrongGuessCount, setWrongGuessCount] = useState(0); // State to store wrong guesses
  const socket = getWebSocket2() as WebSocket;
  const [imageData, setImageData] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) {
      console.error("WebSocket is not available");
      return;
    }

    socket.onmessage = (event) => {
      try {
        const responseJSON = JSON.parse(event.data);
        const action = responseJSON.action;

        if (action === "imageDeliver") {
          const base64Image = responseJSON.imageData;
          setImageData(base64Image);
        } else if (action === "levelComplete") {
          {
            /* pause the websocket */
          }

          // alert(`Level Complete! Winner: ${winner}`);
          // Move to the next level
          // socket.send(JSON.stringify({ action: "nextLevel", roomId: roomID }));
        } else if (action === "startLevel") {
          // Clear the image and reset guess input
          console.log("startlevel called");
          setImageData(null);
          setGuess("");
          // Navigate to the next level
          router.push(
            `/canvas/guess?roomID=${roomID}&promptIndex=${responseJSON.level}`
          );
        } else if (action === "gameOver") {
          const { winner, aiScore, humanScore } = responseJSON;
          alert(
            `Game Over! Winner: ${winner}\nAI Score: ${aiScore}\nHuman Score: ${humanScore}`
          );
          // Redirect to waiting room or home page
          router.push("/waitingroom");
        } else if (action === "guessFeedback") {
          const { correct } = responseJSON;
          if (!correct) {
            // Increment wrong guess count
            setWrongGuessCount((prevCount) => prevCount + 1);
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.onmessage = null;
      socket.onerror = null;
    };
  }, [socket, roomID, router]);

  const handleGuessSubmit = () => {
    if (!socket) {
      console.error("WebSocket is not available");
      return;
    }

    if (guess.trim() === "") {
      console.warn("Empty guess, skipping submission");
      return;
    }

    // Send the guess to the server
    socket.send(
      JSON.stringify({
        action: "humanGuess",
        roomId: roomID,
        guess: guess.trim(),
      })
    );
    console.log("somethign went?");

    setGuess(""); // Clear the input field
    // Removed incrementing wrongGuessCount here
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission or default behavior
      handleGuessSubmit();
    }
  };

  return (
    <div
      className="relative h-screen bg-cover bg-right bg-no-repeat flex items-start justify-start w-full"
      style={{ backgroundImage: "url('/gradbg.svg')" }}
    >
      <div className="relative z-5 flex flex-col items-center w-full h-full text-white pt-5">
        {/* Top Header */}
        <div className="flex justify-between items-center w-full px-8 py-4 bg-[#080F13]">
          <div className="flex-1"></div>{" "}
          {/* Empty div to push content to the center */}
          <h2 className="text-2xl font-semibold text-center font-instrumentSans">
            Prompt: &nbsp;{promptIndex} / 3
          </h2>
          <h1 className="text-4xl font-bold font-londrinaShadow flex-1 text-right">
            LEAP Quick-Draw
          </h1>
        </div>

        {/* Main Content */}
        <div className="flex w-[95%] h-full mb-5">
          {/* Image Display Area */}
          <div className="flex-1 m-4 flex items-center justify-center">
            {imageData ? (
              <Image
                src={imageData}
                alt="Drawing"
                layout="intrinsic"
                width={500}
                height={500}
                className="max-w-full max-h-full border-2 border-black"
              />
            ) : (
              <p className="text-xl">Waiting for drawing...</p>
            )}
          </div>

          {/* Sidebar for Guessing */}
          <div className="w-1/3 text-white m-4 flex flex-col items-center justify-center p-4">
            {/* <h2 className="font-instrumentSans text-xl">
              WRONG GUESS COUNTER: {wrongGuessCount}
            </h2> */}
            <div className="w-full mt-4">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your Guess:"
                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600"
              />
            </div>
            <button
              onClick={handleGuessSubmit}
              className="bg-white text-black px-4 py-2 mt-4 rounded-md"
            >
              Submit Guess
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
