import { getObjectImage } from '~/data/objects'
import { GameObjectData } from '../../types/game'
import { getImagePath } from '../../utils/imagePath'

interface GameObjectProps {
  object: GameObjectData
  gridSize: number
}

export const GameObject = ({ object, gridSize }: GameObjectProps) => {
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
        src={getImagePath(getObjectImage(object.type, object.direction, object.isOpened))}
        alt={object.type}
        className="size-full object-contain"
      />
    </div>
  )
} 