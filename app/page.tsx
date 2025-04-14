import React from "react";
import Link from "next/link";
import { Londrina_Shadow, Instrument_Sans } from "next/font/google";
import Image from "next/image";

const londrinaShadow = Londrina_Shadow({ subsets: ["latin"], weight: "400" });
const instrumentSans = Instrument_Sans({ subsets: ["latin"], weight: "400" });

export default function Home() {
  return (
    <div className="w-full min-h-screen overflow-hidden from-black via-[#0F1C23] to-[#AB572B] bg-gradient-to-br px-4 lg:px-12">
      <div className="flex flex-col lg:flex-row items-center max-lg:gap-8 justify-center">
        {/* Left Content */}
        <div className="flex lg:min-w-[60%] items-center justify-center px-4 lg:px-10">
          <main className="flex flex-col h-full text-center lg:text-left space-y-4 lg:space-y-6 pb-4">
            <span className="text-[40px] lg:text-[63px] font-bold font-instrumentSans text-white mt-[80px] lg:mt-[160px]">
              Welcome to
            </span>
            <span
              className={`text-[56px] lg:text-[108px] font-normal text-white ${londrinaShadow.className}`}
            >
              LEAP Quick-Draw
            </span>
            <p
              className={`text-lg lg:text-2xl text-white ${instrumentSans.className}`}
            >
              This is a game that makes you race against AI in guessing
              drawings. Think you are better?
            </p>

            {/* Buttons */}
            <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-8 mt-20">
              <Link href="/game">
                <button className="bg-red-500 hover:bg-red-600 text-white text-[18px] h-[50px] lg:h-[57px] w-full lg:w-[320px] rounded-[90px] font-bold font-instrumentSans px-4">
                  MULTI-PLAYER
                </button>
              </Link>
            </div>

            {/* <p
              className={`text-gray-300 text-[24px] lg:text-[32px] mt-4 ${shadowsIntoLightTwo.className}`}
            >
              Wanna learn more about our model?
            </p> */}
          </main>
        </div>

        {/* Right Image Section */}
        <div className="w-full lg:min-w-[40%] h-[250px] lg:h-screen relative px-4 lg:px-10">
          <Image
            src="/doodle.png"
            alt="Game Preview"
            fill
            className="absolute bottom-[1px] left-4 right-4 lg:left-10 lg:right-10 w-auto max-w-full h-auto max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
