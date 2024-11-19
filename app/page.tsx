import React from "react";
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-no-repeat"
      style={{ backgroundImage: "url('/homebg.svg')" }}
    >
      <div className="relative z-10 flex items-center justify-between min-h-screen px-10 text-white">
        {/* Left Section - Text */}
        <div className="max-w-md space-y-6">
          <div>
            <h1 className="text-5xl font-bold">Welcome to</h1>
            <h2 className="text-4xl font-bold text-orange-400">
              LEAP Quick-Draw
            </h2>
          </div>
          <p className="text-lg">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s.
          </p>
          <div className="flex gap-4">
            <Link href="/joinroom">
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium">
              Join Room
            </button>
            </Link>
            <Link href="/waitingroom">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium">
              Create Room
            </button>
            </Link>
          </div>
          <p className="text-gray-300 text-sm">
            Wanna learn more about our model?
          </p>
        </div>

        {/* Right Section - Illustration */}
        <div className="hidden lg:block">
          <img
            src="/frog-magnifying-glass.png"
            alt="Illustration"
            className="max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
