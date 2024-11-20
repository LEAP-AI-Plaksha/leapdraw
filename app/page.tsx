import React from "react";
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-no-repeat"
      style={{ backgroundImage: "url('/finhome2.png')" }}
    >
      <div className="relative z-10 flex items-center justify-between h-screen px-10 text-white mx-20">
        {/* Left Section - Text */}
        <div className="max-w-lg space-y-6">
          <div className="">
            <h1 className="text-xl font-bold font-instrumentSans">Welcome to</h1>
            <h2 className="text-7xl font-bold text-orange-400 font-londrinaShadow">
              LEAP Quick-Draw
            </h2>
          </div>
          <p className="text-xl font-instrumentSans">
            This is a game that makes you race against AI in guessing drawings. Think you are better?
          </p>
          <div className="flex gap-4">
            <Link href="/joinroom">
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium font-instrumentSans text-xl">
              Join Room
            </button>
            </Link>
            <Link href="/waitingroom">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium font-instrumentSans text-xl">
              Create Room
            </button>
            </Link>
          </div>
          {/* <p className="text-gray-300 text-sm text-instrumentSans">
            Wanna learn more about our model? Click here!
          </p> */}
        </div>

      </div>
    </div>
  );
};

export default Home;
