import { GameObjectData } from '../../types/game'
import { getObjectImage } from '../../constants/objects'

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
        src={getObjectImage(object.type, object.direction)}
        alt={object.type}
        className="size-full object-contain"
      />
    </div>
  )
} 