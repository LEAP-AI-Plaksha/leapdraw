// app/page.tsx
import CanvasComponent from "../../components/CanvasComponent";

export default function Home() {
  return (
    <div
      className="relative h-screen bg-cover bg-right bg-no-repeat flex items-start justify-start h-full w-full"
      style={{ backgroundImage: "url('/gradbg.svg')" }}
    >
      <div className="relative z-5 flex flex-col items-center w-full h-full text-white mt-5">
        {/* Top Header */}
        <div className="flex justify-between items-center w-full px-8 py-4 bg-[#080F13]">
          <h1 className="text-2xl font-bold">LEAP Quick-Draw</h1>
          <div className="text-lg font-bold">00:00</div>
        </div>

        {/* Main Content */}
        <div className="flex w-[95%] h-full mb-5">
          {/* p5.js Canvas Area */}
          <div className="flex-1 m-4">
            <CanvasComponent />
          </div>

          {/* Sidebar for Leaderboard */}
          <div className="w-1/3 bg-red-700 text-white m-4 flex flex-col items-center justify-between p-4">
            <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
            <ul className="w-full space-y-4">
              {["Player 1", "Player 2", "Player 3", "Player 4", "AI"].map(
                (player, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-black p-2 rounded-md shadow-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold">
                        {index + 1}
                      </div>
                      <span
                        className={`text-${
                          index === 4 ? "gray" : "cyan"
                        }-400`}
                      >
                        {player}
                      </span>
                    </div>
                  </li>
                )
              )}
            </ul>
            <div className="w-full mt-4">
              <input
                type="text"
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
