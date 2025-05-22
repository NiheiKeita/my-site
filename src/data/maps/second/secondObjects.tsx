import { GameObjectData } from "~/types/game"
import { createStairMessage, messageUtils } from "../messages"

export const secondObjects: GameObjectData[] = [
  {
    type: 'stairs',
    position: { x: 7, y: 7 },
    message: messageUtils.createMessage(createStairMessage('up')),
    direction: 'up'
  },
  {
    type: 'stairs',
    position: { x: 0, y: 0 },
    message: messageUtils.createMessage(createStairMessage('down')),
    direction: 'down'
  }
]