import { GameObjectData } from "~/types/game"
import { createStairMessage, messageUtils } from "../messages"

export const thirdObjects: GameObjectData[] = [
  {
    type: 'stairs',
    position: { x: 0, y: 0 },
    message: messageUtils.createMessage(createStairMessage('up')),
    direction: 'up'
  }
]