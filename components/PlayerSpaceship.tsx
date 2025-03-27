import React from "react";

interface PlayerSpaceshipProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function PlayerSpaceship({
  width = 120,
  height = 120,
  color = "#44cc88",
}: PlayerSpaceshipProps) {
  return (
    <svg
      className="spaceship"
      width={width}
      height={height}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="100"
        cy="100"
        rx="60"
        ry="30"
        fill={color}
        stroke="#00ffaa"
        strokeWidth="2"
      />

      <circle
        cx="100"
        cy="80"
        r="20"
        fill="#aaffee"
        stroke="#00ffaa"
        strokeWidth="2"
        opacity="0.8"
      >
        <animate
          attributeName="opacity"
          values="0.7;0.9;0.7"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>

      <ellipse
        cx="100"
        cy="80"
        rx="25"
        ry="10"
        fill="none"
        stroke="#00ffaa"
        strokeWidth="1"
        strokeDasharray="5,3"
      />

      <rect x="70" y="120" width="60" height="10" rx="5" fill="#333" />
      <rect x="80" y="130" width="10" height="15" rx="3" fill="#ff5555">
        <animate
          attributeName="fill"
          values="#ff5555;#ff0000;#ff5555"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>
      <rect x="110" y="130" width="10" height="15" rx="3" fill="#ff5555">
        <animate
          attributeName="fill"
          values="#ff5555;#ff0000;#ff5555"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>

      <path
        d="M70 90 Q100 70 130 90"
        fill="none"
        stroke="#00ffaa"
        strokeWidth="2"
      />
      <path
        d="M80 100 Q100 110 120 100"
        fill="none"
        stroke="#00ffaa"
        strokeWidth="1.5"
      />

      <ellipse
        cx="100"
        cy="100"
        rx="65"
        ry="35"
        fill="none"
        stroke="#00ffaa"
        strokeWidth="1"
        strokeOpacity="0.3"
      >
        <animate
          attributeName="rx"
          values="65;70;65"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="ry"
          values="35;40;35"
          dur="3s"
          repeatCount="indefinite"
        />
      </ellipse>
    </svg>
  );
}
