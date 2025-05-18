import { getImagePath } from '../../utils/imagePath'

interface GameObjectProps {
  type: 'pot' | 'chest' | 'fountain'
  position: {
    x: number
    y: number
  }
  gridSize: number
}

export const GameObject = ({ type, position, gridSize }: GameObjectProps) => {
  const getImage = () => {
    switch (type) {
      case 'pot':
        return getImagePath('/assets/objects/pot.png')
      case 'chest':
        return getImagePath('/assets/objects/chest.png')
      case 'fountain':
        return getImagePath('/assets/objects/fountain.png')
    }
  }

  return (
    <img
      src={getImage()}
      alt={type}
      className="absolute object-contain"
      style={{
        width: gridSize,
        height: gridSize,
        left: position.x * gridSize,
        top: position.y * gridSize,
      }}
    />
  )
} 