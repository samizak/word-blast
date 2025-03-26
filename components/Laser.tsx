import React, { useEffect, useState } from 'react';

interface LaserProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration?: number;
  color?: string;
}

export default function Laser({ 
  startX, 
  startY, 
  endX, 
  endY, 
  duration = 300, 
  color = '#00ffaa' 
}: LaserProps) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Automatically hide the laser after the specified duration
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration]);
  
  if (!visible) return null;
  
  // Calculate the angle for proper laser orientation
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
  
  return (
    <div
      style={{
        position: 'absolute',
        left: `${startX}px`,
        top: `${startY}px`,
        width: `${length}px`,
        height: '3px',
        backgroundColor: color,
        boxShadow: `0 0 8px 2px ${color}`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 0',
        zIndex: 100,
      }}
    />
  );
}