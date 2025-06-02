import { GameObjectData } from "~/types/game"
import { createStairMessage, messageUtils } from "../messages"

export const fourthObjects: GameObjectData[] = [
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
        <p className="text-lg mb-2">✨ 古びた宝箱 ✨</p>
        <p>長い年月を経た宝箱だ。</p>
      </>,
      'text-yellow-300'
    ),
    requiredKey: 'bronze',
    contents: [
      {
        itemId: 'health_potion',
        quantity: 2
      },
      {
        itemId: 'mana_potion',
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
        <p className="text-lg mb-2">💫 癒しの泉 💫</p>
        <p>疲れを癒してくれる泉だ。</p>
        <p className="text-sm mt-2">HP・MPが全回復する気がする...</p>
      </>,
      'text-blue-300'
    )
  }
] 