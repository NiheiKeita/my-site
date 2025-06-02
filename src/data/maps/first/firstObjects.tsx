import { androidApps } from "~/data/objects"
import { GameObjectData } from "~/types/game"
import { createStairMessage, messageUtils } from "../messages"

export const firstObjects: GameObjectData[] = [
  {
    id: 'pot_1',
    type: 'pot',
    position: { x: 2, y: 2 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">✨ Androidアプリを見つけた ✨</p>
        {androidApps.map((app) => (
          <div className="text-yellow-300" key={app.id}>
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 block hover:underline"
            >
              {app.name}
            </a>
          </div>
        ))}
      </>)
  },
  {
    id: 'pot_2',
    type: 'pot',
    position: { x: 5, y: 2 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">✨ 光る壺 ✨</p>
        <p>壺の中に何かが入っている気がする...</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    id: 'chest_1',
    type: 'chest',
    position: { x: 3, y: 3 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">✨ 宝箱 ✨</p>
        <p>中に何かが入っている ブロンズの鍵で開けれるかも？</p>
      </>,
      'text-yellow-300'
    ),
    requiredKey: 'bronze_key',
    contents: [
      {
        itemId: 'healing_potion',
        quantity: 1
      }
    ]
  },
  {
    id: 'chest_2',
    type: 'chest',
    position: { x: 5, y: 5 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">✨ 輝く宝箱 ✨</p>
        <p>宝箱の中から光が漏れている... いい鍵が必要かも？？</p>
      </>,
      'text-yellow-300'
    ),
    requiredKey: 'gold_key',
    contents: [
      {
        itemId: 'healing_potion',
        quantity: 20
      }
    ]
  },
  {
    id: 'fountain_1',
    type: 'fountain',
    position: { x: 0, y: 0 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">💫 神秘の泉 💫</p>
        <p>神秘的な力が宿る泉だ。</p>
        <p className="text-sm mt-2">HP・MPが全回復する気がする...</p>
      </>,
      'text-blue-300'
    )
  },
  {
    id: 'item_1',
    type: 'item',
    itemId: 'healing_potion',
    position: { x: 6, y: 2 },
    message: messageUtils.createMessage(
      <>
        <p>何かが落ちている</p>
      </>,
      'text-blue-300'
    )
  },
  {
    id: 'stairs_1',
    type: 'stairs',
    position: { x: 7, y: 7 },
    message: messageUtils.createMessage(createStairMessage('down')),
    direction: 'down'
  }
]