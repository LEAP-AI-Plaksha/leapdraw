import React from "react";
import Link from "next/link";

const WaitingRoomPage: React.FC = () => {
  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: "#EA4A2E" }}
    >
      {/* Header */}
      <div className="absolute top-5 left-5 flex items-center space-x-2">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <span className="text-white text-xl">&larr;</span>
            <span className="ml-2 text-white font-medium">leave</span>
          </div>
        </Link>
      </div>

      <div className="absolute top-5 right-5">
        <h1 className="text-white text-xl font-bold">LEAP Quick-Draw</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold">Room: 229348349</h2>
        <div className="mt-8 text-center">
          <h1 className="text-4xl font-bold">Waiting for</h1>
          <h1 className="text-4xl font-bold">
            Player <span className="italic font-light">* ______ *</span>
          </h1>
          <h1 className="text-4xl font-bold">to accept the Challenge</h1>
        </div>
      </div>

      {/* Image */}
      <div className="absolute bottom-0 right-0">
        <img
          src="/waitingroomimage.svg"
          alt="Waiting Room Illustration"
          className="w-64 h-64"
        />
      </div>
    </div>
  );
};

export default WaitingRoomPage;
