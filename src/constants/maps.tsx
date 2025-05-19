import React from 'react'
import { MapData } from '../types/game'
import { androidApps } from './objects'

export const maps: MapData[] = [
  {
    id: 'first-floor',
    name: '1階',
    width: 8,
    height: 8,
    gameObjects: [
      {
        type: 'pot',
        position: { x: 2, y: 2 },
        message: (
          <div className="text-gray-300">
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
          </div>
        )
      },
      {
        type: 'pot',
        position: { x: 5, y: 2 },
        message: (
          <div className="text-yellow-300">
            <p className="text-lg mb-2">✨ 光る壺 ✨</p>
            <p>壺の中に何かが入っている気がする...</p>
          </div>
        )
      },
      {
        type: 'chest',
        position: { x: 2, y: 5 },
        message: (
          <div className="text-gray-300">
            <p className="text-lg mb-2">宝箱</p>
            <p>宝箱は固く閉ざされている。</p>
          </div>
        )
      },
      {
        type: 'chest',
        position: { x: 5, y: 5 },
        message: (
          <div className="text-yellow-300">
            <p className="text-lg mb-2">✨ 輝く宝箱 ✨</p>
            <p>宝箱の中から光が漏れている...</p>
          </div>
        )
      },
      {
        type: 'fountain',
        position: { x: 0, y: 0 },
        message: (
          <div className="text-blue-300">
            <p className="text-lg mb-2">💫 神秘の泉 💫</p>
            <p>神秘的な力が宿る泉だ。</p>
            <p className="text-sm mt-2">HPが全回復するかもしれない...</p>
          </div>
        )
      },
      {
        type: 'stairs',
        position: { x: 7, y: 7 },
        message: (
          <div className="text-gray-300">
            <p className="text-lg mb-2">下へ続く階段</p>
            <p>下の階へ続く階段がある。</p>
          </div>
        ),
        direction: 'down'
      }
    ],
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
    gameObjects: [
      {
        type: 'stairs',
        position: { x: 7, y: 7 },
        message: (
          <div className="text-gray-300">
            <p className="text-lg mb-2">上へ続く階段</p>
            <p>上の階へ続く階段がある。</p>
          </div>
        ),
        direction: 'up'
      },
      {
        type: 'stairs',
        position: { x: 0, y: 0 },
        message: (
          <div className="text-gray-300">
            <p className="text-lg mb-2">下へ続く階段</p>
            <p>下の階へ続く階段がある。</p>
          </div>
        ),
        direction: 'down'
      }
    ],
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
    gameObjects: [
      {
        type: 'stairs',
        position: { x: 0, y: 0 },
        message: (
          <div className="text-gray-300">
            <p className="text-lg mb-2">下へ続く階段</p>
            <p>下の階へ続く階段がある。</p>
          </div>
        ),
        direction: 'up'
      }
    ],
    stairs: {
      up: {
        mapId: 'second-floor',
        position: { x: 0, y: 0 }
      }
    }
  }
]
