import { GRID_SIZE } from '../Map'

interface GameObjectProps {
  type: 'pot' | 'chest';
  position: {
    x: number;
    y: number;
  };
}

export const GameObject = ({ type, position }: GameObjectProps) => {
  return (
    <img
      src={`/assets/objects/${type}.png`}
      alt={`${type === 'pot' ? '壺' : '宝箱'}`}
      className="absolute size-12"
      style={{
        left: `${position.x * GRID_SIZE}px`,
        top: `${position.y * GRID_SIZE}px`,
      }}
    />
  )
} 