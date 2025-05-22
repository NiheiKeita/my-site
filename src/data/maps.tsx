import React from 'react'
import { MapData, GameObjectData } from '../types/game'
import { androidApps } from './objects'

// メッセージ生成用のユーティリティ関数
export const messageUtils = {
  createMessage: (content: React.ReactNode, className: string = 'text-gray-300') => (
    <div className={className}>
      {content}
    </div>
  ),

  createAndroidAppMessage: () => (
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
    </>
  ),

  createStairMessage: (direction: 'up' | 'down') => (
    <>
      <p className="text-lg mb-2">{direction === 'up' ? '上へ続く階段' : '下へ続く階段'}</p>
      <p>{direction === 'up' ? '上の階へ続く階段がある。' : '下の階へ続く階段がある。'}</p>
    </>
  )
}

// マップデータの定義
const firstFloorObjects: GameObjectData[] = [
  {
    type: 'pot',
    position: { x: 2, y: 2 },
    message: messageUtils.createMessage(messageUtils.createAndroidAppMessage())
  },
  {
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
    type: 'chest',
    position: { x: 2, y: 5 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">宝箱</p>
        <p>宝箱は固く閉ざされている。</p>
      </>
    )
  },
  {
    type: 'chest',
    position: { x: 5, y: 5 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">✨ 輝く宝箱 ✨</p>
        <p>宝箱の中から光が漏れている...</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    type: 'fountain',
    position: { x: 0, y: 0 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">💫 神秘の泉 💫</p>
        <p>神秘的な力が宿る泉だ。</p>
        <p className="text-sm mt-2">HPが全回復するかもしれない...</p>
      </>,
      'text-blue-300'
    )
  },
  {
    type: 'item',
    itemId: 'copper_sword',
    position: { x: 7, y: 1 },
    message: messageUtils.createMessage(
      <>
        <p>何かが落ちている</p>
      </>,
      'text-blue-300'
    )
  },
  {
    type: 'stairs',
    position: { x: 7, y: 7 },
    message: messageUtils.createMessage(messageUtils.createStairMessage('down')),
    direction: 'down'
  }
]

const secondFloorObjects: GameObjectData[] = [
  {
    type: 'stairs',
    position: { x: 7, y: 7 },
    message: messageUtils.createMessage(messageUtils.createStairMessage('up')),
    direction: 'up'
  },
  {
    type: 'stairs',
    position: { x: 0, y: 0 },
    message: messageUtils.createMessage(messageUtils.createStairMessage('down')),
    direction: 'down'
  }
]

const thirdFloorObjects: GameObjectData[] = [
  {
    type: 'stairs',
    position: { x: 0, y: 0 },
    message: messageUtils.createMessage(messageUtils.createStairMessage('up')),
    direction: 'up'
  }
]

// マップデータのエクスポート
export const maps: MapData[] = [
  {
    id: 'first-floor',
    name: '1階',
    width: 8,
    height: 8,
    gameObjects: firstFloorObjects,
    stairs: {
      down: {
        mapId: 'second-floor',
        position: { x: 7, y: 7 }
      }
    }
  },
  {
    id: 'second-floor',
    name: '2階',
    width: 8,
    height: 8,
    gameObjects: secondFloorObjects,
    stairs: {
      up: {
        mapId: 'first-floor',
        position: { x: 7, y: 7 }
      },
      down: {
        mapId: 'third-floor',
        position: { x: 0, y: 0 }
      }
    }
  },
  {
    id: 'third-floor',
    name: '3階',
    width: 8,
    height: 8,
    gameObjects: thirdFloorObjects,
    stairs: {
      up: {
        mapId: 'second-floor',
        position: { x: 0, y: 0 }
      }
    }
  }
]
