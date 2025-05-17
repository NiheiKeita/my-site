import { GRID_SIZE } from '../Map'

interface GameObjectProps {
  type: 'pot' | 'chest'
  position: {
    x: number
    y: number
  }
  gridSize?: number
}

export const GameObject = ({ type, position, gridSize = GRID_SIZE }: GameObjectProps) => {
  return (
    <img
      src={`/assets/objects/${type}.png`}
      alt={type}
      className="absolute transition-transform duration-150"
      style={{
        width: `${gridSize}px`,
        height: `${gridSize}px`,
        left: `${position.x * gridSize}px`,
        top: `${position.y * gridSize}px`,
      }}
    />
  )
} 