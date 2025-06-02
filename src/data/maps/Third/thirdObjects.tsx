import { GameObjectData } from "~/types/game"
import { createStairMessage, messageUtils } from "../messages"

export const thirdObjects: GameObjectData[] = [
  {
    id: 'stairs_1',
    type: 'stairs',
    position: { x: 5, y: 5 },
    message: messageUtils.createMessage(createStairMessage('up')),
    direction: 'up'
  },
  {
    id: 'stairs_2',
    type: 'stairs',
    position: { x: 0, y: 0 },
    message: messageUtils.createMessage(createStairMessage('up')),
    direction: 'down'
  },
  {
    id: 'chest_1',
    type: 'chest',
    position: { x: 7, y: 7 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">✨ 宝箱 ✨</p>
        <p>中に何かが入っている </p>
      </>,
      'text-yellow-300'
    ),
    contents: [
      {
        itemId: 'healing_potion',
        quantity: 1
      }
    ]
  },
]