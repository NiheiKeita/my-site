import { GameObjectData } from "~/types/game"
import { createStairMessage, messageUtils } from "../messages"

export const fifthObjects: GameObjectData[] = [
  {
    id: 'stairs_1',
    type: 'stairs',
    position: { x: 7, y: 7 },
    message: messageUtils.createMessage(createStairMessage('up')),
    direction: 'up'
  },
  {
    id: 'stairs_2',
    type: 'stairs',
    position: { x: 0, y: 0 },
    message: messageUtils.createMessage(createStairMessage('down')),
    direction: 'down'
  },
  {
    id: 'chest_1',
    type: 'chest',
    position: { x: 2, y: 2 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">✨ 魔法の宝箱 ✨</p>
        <p>魔法の力が宿る宝箱だ。</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    id: 'item_1',
    type: 'item',
    itemId: 'raspberry_pi',
    position: { x: 5, y: 5 },
    message: messageUtils.createMessage(
      <>
        <p>何かが落ちている</p>
      </>,
      'text-blue-300'
    )
  }
] 