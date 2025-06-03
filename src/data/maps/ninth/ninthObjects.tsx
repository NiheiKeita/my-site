import { GameObjectData } from "~/types/game"
import { createStairMessage, messageUtils } from "../messages"

export const ninthObjects: GameObjectData[] = [
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
        <p className="text-lg mb-2">✨ 伝説の宝箱 ✨</p>
        <p>伝説に語り継がれる宝箱だ。</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    id: 'item_1',
    type: 'item',
    itemId: 'gold_key',
    position: { x: 6, y: 2 },
    message: messageUtils.createMessage(
      <>
        <p>何かが落ちている</p>
      </>,
      'text-blue-300'
    )
  },
  {
    id: 'item_2',
    type: 'item',
    itemId: 'legendary_sword',
    position: { x: 5, y: 5 },
    message: messageUtils.createMessage(
      <>
        <p>何かが落ちている</p>
      </>,
      'text-blue-300'
    )
  }
] 