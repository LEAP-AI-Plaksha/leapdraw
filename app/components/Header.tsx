import React,{ReactNode} from "react";
import Link from "next/link";
import { Londrina_Shadow } from "next/font/google";

const londrinaShadow = Londrina_Shadow({ subsets: ["latin"], weight: "400" });

interface HeaderProps {
  centerElement: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ centerElement }) => {
  return (
    <div className="relative flex flex-row justify-between items-center lg:px-8 w-full">
      {/* Back Button - Aligned Left */}
      <Link href="/">
        <div className="flex items-center cursor-pointer">
          <img
            src="/backbutton.svg"
            alt="Back"
            className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
          />
          <span className="ml-2 text-white font-extrabold text-sm md:text-lg lg:text-xl font-instrumentSans">
            leave
          </span>
        </div>
      </Link>

      {/* Center Element - Absolutely Centered */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        {centerElement}
      </div>

      {/* Title - Aligned Right */}
      <span
        className={`text-2xl md:text-3xl lg:text-5xl font-extrabold text-white ${londrinaShadow.className}`}
      >
        LEAP Quick-Draw
      </span>
    </div>
  );
};

export default Header;
