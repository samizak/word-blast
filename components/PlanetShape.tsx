import React from 'react';

type PlanetType = 'rocky' | 'gas' | 'ice' | 'lava' | 'earth' | 'ringed';

interface PlanetShapeProps {
  type: PlanetType;
  size: number;
  word: string;
}

export default function PlanetShape({ type, size: minSize, word }: PlanetShapeProps) {
  // Calculate dynamic size based on word length
  // Longer words need bigger planets
  const baseSize = minSize;
  const charWidth = 8; // Approximate width of each character in pixels
  const wordWidth = word.length * charWidth;
  const padding = 20; // Extra padding around the text
  
  // Calculate the size needed to fit the word with padding
  const calculatedSize = Math.max(baseSize, wordWidth + padding);
  const size = calculatedSize;

  // Generate colors based on planet type
  const getPlanetColors = () => {
    switch (type) {
      case 'rocky':
        return {
          main: '#A67C52',
          accent: '#8B5A2B',
          highlight: '#D2B48C'
        };
      case 'gas':
        return {
          main: '#E6B422',
          accent: '#CD853F',
          highlight: '#FFD700'
        };
      case 'ice':
        return {
          main: '#ADD8E6',
          accent: '#87CEEB',
          highlight: '#E0FFFF'
        };
      case 'lava':
        return {
          main: '#8B0000',
          accent: '#FF4500',
          highlight: '#FF6347'
        };
      case 'earth':
        return {
          main: '#4682B4',
          accent: '#228B22',
          highlight: '#87CEEB'
        };
      case 'ringed':
        return {
          main: '#DEB887',
          accent: '#D2B48C',
          highlight: '#F5DEB3'
        };
      default:
        return {
          main: '#A67C52',
          accent: '#8B5A2B',
          highlight: '#D2B48C'
        };
    }
  };

  const colors = getPlanetColors();
  const radius = size / 2;

  // Create different planet patterns based on type
  const renderPlanetPattern = () => {
    switch (type) {
      case 'rocky':
        return (
          <>
            <circle cx={radius} cy={radius} r={radius} fill={colors.main} />
            <circle cx={radius * 0.7} cy={radius * 0.7} r={radius * 0.1} fill={colors.accent} />
            <circle cx={radius * 1.3} cy={radius * 0.8} r={radius * 0.15} fill={colors.accent} />
            <circle cx={radius * 0.5} cy={radius * 1.2} r={radius * 0.12} fill={colors.accent} />
          </>
        );
      case 'gas':
        return (
          <>
            <circle cx={radius} cy={radius} r={radius} fill={colors.main} />
            <ellipse cx={radius} cy={radius * 0.7} rx={radius * 0.9} ry={radius * 0.2} fill={colors.accent} opacity="0.7" />
            <ellipse cx={radius} cy={radius * 1.3} rx={radius * 0.9} ry={radius * 0.2} fill={colors.accent} opacity="0.7" />
          </>
        );
      case 'ice':
        return (
          <>
            <circle cx={radius} cy={radius} r={radius} fill={colors.main} />
            <circle cx={radius * 0.6} cy={radius * 0.6} r={radius * 0.2} fill={colors.highlight} />
            <circle cx={radius * 1.2} cy={radius * 1.2} r={radius * 0.15} fill={colors.highlight} />
            <circle cx={radius * 1.3} cy={radius * 0.7} r={radius * 0.1} fill={colors.highlight} />
          </>
        );
      case 'lava':
        return (
          <>
            <circle cx={radius} cy={radius} r={radius} fill={colors.main} />
            <path d={`M ${radius * 0.5},${radius * 0.8} Q ${radius},${radius * 0.3} ${radius * 1.5},${radius * 0.8}`} stroke={colors.accent} strokeWidth="4" fill="none" />
            <path d={`M ${radius * 0.5},${radius * 1.2} Q ${radius},${radius * 1.7} ${radius * 1.5},${radius * 1.2}`} stroke={colors.accent} strokeWidth="4" fill="none" />
          </>
        );
      case 'earth':
        return (
          <>
            <circle cx={radius} cy={radius} r={radius} fill={colors.main} />
            <path d={`M ${radius * 0.3},${radius * 0.7} Q ${radius * 0.8},${radius * 0.5} ${radius * 1.2},${radius * 0.6} T ${radius * 1.7},${radius * 0.7}`} stroke={colors.accent} strokeWidth="5" fill="none" />
            <path d={`M ${radius * 0.3},${radius * 1.3} Q ${radius * 0.8},${radius * 1.5} ${radius * 1.2},${radius * 1.4} T ${radius * 1.7},${radius * 1.3}`} stroke={colors.accent} strokeWidth="5" fill="none" />
          </>
        );
      case 'ringed':
        return (
          <>
            <circle cx={radius} cy={radius} r={radius * 0.8} fill={colors.main} />
            <ellipse cx={radius} cy={radius} rx={radius} ry={radius * 0.3} fill="none" stroke={colors.accent} strokeWidth="3" />
          </>
        );
      default:
        return <circle cx={radius} cy={radius} r={radius} fill={colors.main} />;
    }
  };

  return (
    <div className="planet-container" style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {renderPlanetPattern()}
      </svg>
      <div 
        className="planet-word-background"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(40, 40, 40, 0.7)',
          borderRadius: '4px',
          padding: '2px 6px',
          maxWidth: '90%'
        }}
      >
        <div 
          className="planet-word" 
          style={{ 
            color: '#FFFFFF',
            textShadow: '1px 1px 2px black',
            fontWeight: 'bold',
            fontSize: `${Math.max(12, size / (word.length + 2))}px`,
            textAlign: 'center',
          }}
        >
          {word}
        </div>
      </div>
    </div>
  );
}