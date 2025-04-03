import React from "react";
import Header from "../components/Header";
import { Londrina_Shadow, Instrument_Sans } from "next/font/google";
import Link from "next/link";

const roomcode = Instrument_Sans({ subsets: ["latin"], weight: "700" });
const draw = Instrument_Sans({ subsets: ["latin"], weight: "700" });
const londrinashadow = Londrina_Shadow({ subsets: ["latin"], weight: "400" });

const AssignmentPage: React.FC = () => {
  return (
    <div
      className="h-screen w-screen flex flex-col 
     bg-no-repeat bg-[url('/assignbg.png')] bg-[#EA4A2E] bg-[length:90%] bg-[right_-1%_bottom]"
    >
      {/* Header Section - 20% Height */}
      <div className="h-[20%]">
        <Header
          centerElement={
            <span
              className={`${roomcode.className} text-white font-extrabold text-[42px] drop-shadow-[0_0_2px_black]`}
            >
              Room:9999999
            </span>
          }
        />
      </div>

      {/* Bubble Section - 30% Height */}
      <div className="absolute top-[28%] left-[29%] h-[30%] flex flex-col  text-white justify-center">
        <span
          className={`${draw.className} text-white text-[48px] text-center font-extrabold`}
        >
          Draw
        </span>
        <span
          className={`${londrinashadow.className} text-white text-center text-[86px] font-extrabold`}
        >
          PROMPT
        </span>
        <span
          className={`${roomcode.className} text-white text-center text-[48px] font-bold`}
        >
          in 30 seconds
        </span>
      </div>

      {/* Button Section - 50% Height */}
      <div className="h-[90%] flex items-end px-12 py-4 ">
        <Link href="/assignment">
          <button className=" bg-black text-white text-[24px] h-12 w-72 rounded-[80px] font-bold">
            Challenge accepted  
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AssignmentPage;
