// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import CanvasComponent from "../../components/CanvasComponent";

export default function Home() {
  const [guess, setGuess] = useState(""); // State to store the guess input
  const [wrongGuessCount, setWrongGuessCount] = useState(0); // State to store wrong guesses
  const [promptIndex, setPromptIndex] = useState(1); // State to store the current prompt index
  
  // // Fetch prompt index from API
  // useEffect(() => {
  //   const fetchPromptIndex = async () => {
  //     // Placeholder for API call
  //     // const response = await fetch("/api/getPromptIndex"); // Replace with your actual API endpoint
  //     // const data = await response.json();
  //     // setPromptIndex(data.promptIndex || 1); // Set fetched prompt index, default to 1 if not available
  //     setPromptIndex(1);
  //   };

  //   fetchPromptIndex();
  // }, []);

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
      className="relative h-screen bg-cover bg-right bg-no-repeat flex items-start justify-start h-full w-full"
      style={{ backgroundImage: "url('/gradbg.svg')" }}
    >
      <div className="relative z-5 flex flex-col items-center w-full h-full text-white mt-5">
        {/* Top Header */}
<div className="flex justify-between items-center w-full px-8 py-4 bg-[#080F13]">
  <div className="flex-1"></div> {/* Empty div to push content to the center */}
  <h2 className="text-2xl font-semibold text-center">Prompt {promptIndex} / 5</h2>
  <h1 className="text-4xl font-bold font-londrinaShadow flex-1 text-right">LEAP Quick-Draw</h1>
</div>


        {/* Main Content */}
        <div className="flex w-[95%] h-full mb-5">
          {/* p5.js Canvas Area */}
          <div className="flex-1 m-4">
            <CanvasComponent />
          </div>

          {/* Sidebar for Leaderboard */}
          <div className="w-1/3 text-white m-4 flex flex-col items-center justify-center p-4">
            <h2>Wrong Guess Counter: {wrongGuessCount}</h2>
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
