import { GameObjectData } from "~/types/game"
import { createStairMessage, messageUtils } from "../messages"

export const tenthObjects: GameObjectData[] = [
  {
    id: 'stairs_1',
    type: 'stairs',
    position: { x: 0, y: 0 },
    message: messageUtils.createMessage(createStairMessage('up')),
    direction: 'up'
  },
  {
    id: 'chest_1',
    type: 'chest',
    position: { x: 3, y: 3 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">✨ 最終の宝箱 ✨</p>
        <p>ダンジョンの最深部に眠る宝箱だ。</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    id: 'fountain_1',
    type: 'fountain',
    position: { x: 4, y: 4 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">💫 究極の泉 💫</p>
        <p>究極の力が宿る泉だ。</p>
        <p className="text-sm mt-2">HP・MPが全回復する気がする...</p>
      </>,
      'text-blue-300'
    )
  },
  {
    id: 'boss_chest',
    type: 'chest',
    position: { x: 7, y: 7 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">✨ ボスの宝箱 ✨</p>
        <p>ボスを倒した証の宝箱だ。</p>
      </>,
      'text-yellow-300'
    )
  }
] 