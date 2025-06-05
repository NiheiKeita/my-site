import { GameObjectData } from "~/types/game"
import { createStairMessage, messageUtils } from "../messages"

export const eighthObjects: GameObjectData[] = [
  {
    id: 'stairs_1',
    type: 'stairs',
    position: { x: 0, y: 0 },
    message: messageUtils.createMessage(createStairMessage('up')),
    direction: 'up'
  },
  {
    id: 'stairs_2',
    type: 'stairs',
    position: { x: 7, y: 7 },
    message: messageUtils.createMessage(createStairMessage('down')),
    direction: 'down'
  },
  {
    id: 'chest_1',
    type: 'chest',
    position: { x: 3, y: 3 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">✨ 神話の宝箱 ✨</p>
        <p>神話に語り継がれる宝箱だ。</p>
      </>,
      'text-yellow-300'
    ),
    requiredKey: 'legendary_key',
    contents: [
      {
        itemId: 'nintendo_switch',
        quantity: 1
      },
      {
        itemId: 'mobile_battery',
        quantity: 1
      }
    ]
  },
  {
    id: 'fountain_1',
    type: 'fountain',
    position: { x: 4, y: 4 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">💫 神聖な泉 💫</p>
        <p>神聖な力が宿る泉だ。</p>
        <p className="text-sm mt-2">HP・MPが全回復する気がする...</p>
      </>,
      'text-blue-300'
    )
  }
] 