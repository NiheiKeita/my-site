import { GameObjectData } from '../../types/game'
import { getImagePath } from '../../utils/imagePath'

interface GameObjectProps {
  object: GameObjectData
  gridSize: number
}

export const GameObject = ({ object, gridSize }: GameObjectProps) => {
  const getImage = () => {
    switch (object.type) {
      case 'pot':
        return getImagePath('/assets/objects/pot.png')
      case 'chest':
        return getImagePath('/assets/objects/chest.png')
      case 'fountain':
        return getImagePath('/assets/objects/fountain.png')
      case 'stairs':
        return getImagePath(`/assets/objects/stairs_${object.direction}.png`)
      default:
        return ''
    }
  }

  return (
    <div
      className="absolute"
      style={{
        left: object.position.x * gridSize,
        top: object.position.y * gridSize,
        width: gridSize,
        height: gridSize,
      }}
    >
      <img
        src={getImage()}
        alt={object.type}
        className="size-full object-contain"
      />
    </div>
  )
} 