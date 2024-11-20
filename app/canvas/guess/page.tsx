"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
  const [guess, setGuess] = useState(""); // State to store the guess input
  const [wrongGuessCount, setWrongGuessCount] = useState(0); // State to store wrong guesses
  const [promptIndex, setPromptIndex] = useState(1); // State to store the current prompt index

  useEffect(() => {
    // WebSocket connection setup
    const wsUrl = "ws://localhost:8765"; // Replace with your WebSocket URL
    const socket = new WebSocket(wsUrl);

    // When WebSocket receives a message
    socket.onmessage = (event) => {
      try {
        const base64Image = event.data; // Assuming the WebSocket sends a base64 string
        const drawingImage = document.getElementById("drawingImage");
        if (drawingImage) {
          // Set the received base64 image as the background
          drawingImage.style.backgroundImage = `url(${base64Image})`;
          drawingImage.style.backgroundSize = "contain";
          drawingImage.style.backgroundRepeat = "no-repeat";
          drawingImage.style.backgroundPosition = "center";
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    // Handle WebSocket errors
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Clean up WebSocket connection on unmount
    return () => {
      socket.close();
    };
  }, []); // Runs once on component mount

  // Function to handle guess submission
  const handleGuessSubmit = async () => {
    // Make an API call (placeholder for now)
    const isCorrect = false; // Replace with API response

    if (!isCorrect) {
      setWrongGuessCount((prevCount) => prevCount + 1); // Increment wrong guess count
    }
    setGuess(""); // Clear the input field
  };

  // Function to handle Enter key press
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
          <div className="flex-1"></div> {/* Empty div to push content to the center */}
          <h2 className="text-2xl font-semibold text-center font-instrumentSans">
            Prompt: &nbsp;{promptIndex} / 5
          </h2>
          <h1 className="text-4xl font-bold font-londrinaShadow flex-1 text-right">
            LEAP Quick-Draw
          </h1>
        </div>

        {/* Main Content */}
        <div className="flex w-[95%] h-full mb-5">
          {/* p5.js Canvas Area */}
          <div className="flex-1 m-4">
            {/* square div */}
            <div
              id="drawingImage"
              className="w-full h-full bg-white"
              style={{
                border: "2px solid black",
              }}
            ></div>
          </div>

          {/* Sidebar for Leaderboard */}
          <div className="w-1/3 text-white m-4 flex flex-col items-center justify-center p-4">
            <h2 className="font-instrumentSans text-xl">
              WRONG GUESS COUNTER: {wrongGuessCount}
            </h2>
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
          </div>
        </div>
      </div>
    </div>
  );
}
