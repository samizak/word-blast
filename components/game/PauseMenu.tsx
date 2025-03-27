import React from "react";

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestart,
  onQuit,
}) => {
  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="relative">
        <h2
          className="text-6xl font-bold mb-12 text-center"
          style={{
            color: "#ff00ff",
            textShadow: "0 0 5px #ff00ff, 0 0 10px #ff00ff",
          }}
        >
          PAUSED
        </h2>

        <div
          className="relative p-8 rounded-lg"
          style={{
            background: "rgba(0, 0, 0, 0.8)",
            border: "2px solid var(--game-accent)",
            boxShadow: "0 0 10px var(--game-accent)",
          }}
        >
          <div className="space-y-6">
            <button
              onClick={onResume}
              className="w-full py-4 px-8 text-xl font-bold rounded transition-all duration-200 hover:scale-105 cursor-pointer"
              style={{
                background: "transparent",
                border: "2px solid var(--game-accent)",
                color: "var(--game-accent)",
                textShadow: "0 0 2px var(--game-accent)",
                boxShadow: "0 0 5px var(--game-accent)",
              }}
            >
              RESUME
            </button>
            <button
              onClick={onRestart}
              className="w-full py-4 px-8 text-xl font-bold rounded transition-all duration-200 hover:scale-105 cursor-pointer"
              style={{
                background: "transparent",
                border: "2px solid #ffff00",
                color: "#ffff00",
                textShadow: "0 0 2px #ffff00",
                boxShadow: "0 0 5px #ffff00",
              }}
            >
              RESTART
            </button>
            <button
              onClick={onQuit}
              className="w-full py-4 px-8 text-xl font-bold rounded transition-all duration-200 hover:scale-105 cursor-pointer"
              style={{
                background: "transparent",
                border: "2px solid var(--enemy-color)",
                color: "var(--enemy-color)",
                textShadow: "0 0 2px var(--enemy-color)",
                boxShadow: "0 0 5px var(--enemy-color)",
              }}
            >
              QUIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;
