import React from "react";
import Link from "next/link";

const EnterNamePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white items-center justify-center px-4">
      {/* Header Section */}
      <div className="absolute top-5 left-5 flex items-center space-x-2">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <span className="text-white text-xl">&larr;</span>
            <span className="ml-2 text-white font-medium">leave</span>
          </div>
        </Link>
      </div>

      {/* Title Section */}
      <div className="absolute top-5 right-5">
        <h1 className="text-white text-xl font-bold">LEAP Quick-Draw</h1>
      </div>

      {/* Join Room Form */}
      <div className="flex flex-col items-center justify-center space-y-6">
        <input
          type="text"
          placeholder="Enter your name..."
          className="w-full max-w-xs text-center text-lg py-3 border-b-2 border-orange-500 bg-transparent text-white outline-none placeholder-gray-500"
        />
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded-md">
          Enter Name
        </button>
      </div>
    </div>
  );
};

export default EnterNamePage;
