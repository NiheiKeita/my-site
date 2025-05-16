import React from 'react'

interface CharacterProps {
  position: {
    x: number;
    y: number;
  };
  direction: 'up' | 'down' | 'left' | 'right';
}

export const Character = ({ position, direction }: CharacterProps) => {
  return (
    <img
      src={`/assets/characters/hero_${direction}.PNG`}
      alt={`Character facing ${direction}`}
      className="absolute size-8 transition-all duration-100"
      style={{
        left: `${position.x * 32}px`,
        top: `${position.y * 32}px`,
      }}
    />
  )
} 