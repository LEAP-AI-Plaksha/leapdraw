import React from "react";

const ErrorPage: React.FC = () => {
  return (
    <div className="w-full h-screen bg-[#EA4A2E] flex items-center justify-center">
      <div className="flex flex-col md:flex-row items-center w-full h-full bg-[#EA4A2E] md:px-16 space-y-6 md:space-y-0 md:space-x-12 ">
        {/* Text Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/2">
          <div>
            <h1 className="text-[64px] font-semibold text-white font-inter">
              404 Error
            </h1>
            <p className="text-[24px] font-medium text-white mb-2 font-inter">
              (not really)
            </p>
          </div>

          <div>
            <p className="text-[24px] font-semibold font-inter text-white mb-2">
              Are you sure you want to quit the game?
            </p>
            <p className="text-[24px] font-inter text-white mb-6">
              Your progress will not be saved :(
            </p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-black hover:bg-red-900 text-white text-[18px] h-[50px] lg:h-[57px] w-full lg:w-[170px] rounded-[50px] font-bold font-instrumentSans px-4">
              YES
            </button>
            <button className="bg-black hover:bg-red-900 text-white text-[18px] h-[50px] lg:h-[57px] w-full lg:w-[170px] rounded-[50px] font-bold font-instrumentSans px-4">
              NO
            </button>
          </div>
        </div>
        {/* Image Section */}
        <div className="w-full md:w-1/2 h-full relative">
          <img
            src="/magnify.svg"
            alt="404 Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
