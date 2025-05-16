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
      className="absolute size-8"
      style={{
        left: `${position.x * 32}px`,
        top: `${position.y * 32}px`,
      }}
    />
  )
} 