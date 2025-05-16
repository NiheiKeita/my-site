'use client'

import { useEffect, useState } from 'react'
import { Character } from '../Character'
import { Map } from '../Map'
import { TouchControls } from '../TouchControls'
import { Popup } from '../Popup'
import { GameObject } from '../GameObject'

interface Position {
  x: number
  y: number
}

interface GameObject {
  type: 'pot' | 'chest'
  position: Position
}

export const Game = () => {
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 4, y: 4 })
  const [playerDirection, setPlayerDirection] = useState<'up' | 'down' | 'left' | 'right'>('down')
  const [showPopup, setShowPopup] = useState(false)
  const [popupContent, setPopupContent] = useState('')
  const [gameObjects] = useState<GameObject[]>([
    { type: 'pot', position: { x: 2, y: 2 } },
    { type: 'pot', position: { x: 5, y: 2 } },
    { type: 'chest', position: { x: 2, y: 5 } },
    { type: 'chest', position: { x: 5, y: 5 } },
  ])

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    // ポップアップ表示中は移動しない
    if (showPopup) return

    setPlayerDirection(direction)
    const newPosition = { ...playerPosition }

    switch (direction) {
      case 'up':
        newPosition.y = Math.max(0, playerPosition.y - 1)
        break
      case 'down':
        newPosition.y = Math.min(7, playerPosition.y + 1)
        break
      case 'left':
        newPosition.x = Math.max(0, playerPosition.x - 1)
        break
      case 'right':
        newPosition.x = Math.min(7, playerPosition.x + 1)
        break
    }

    // オブジェクトとの衝突チェック
    const isCollision = gameObjects.some(
      (obj) => obj.position.x === newPosition.x && obj.position.y === newPosition.y
    )

    // 衝突している場合は、元の位置に戻す
    if (isCollision) {
      newPosition.x = playerPosition.x
      newPosition.y = playerPosition.y
    }

    // 位置を更新してアニメーションを表示
    setPlayerPosition(newPosition)

    // 25分の1の確率でランダムなメッセージを表示
    if (Math.random() < 0.04) {
      const messages = [
        '何かが動いた気がする...',
        '風の音が聞こえる...',
        '遠くで何かの音がする...',
        '不思議な気配を感じる...',
        '何かが光っている...',
      ]
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      setPopupContent(randomMessage)
      setShowPopup(true)
    }
  }

  const handleInteract = () => {
    // ポップアップ表示中はインタラクションしない
    if (showPopup) return

    const frontPosition = { ...playerPosition }
    switch (playerDirection) {
      case 'up':
        frontPosition.y -= 1
        break
      case 'down':
        frontPosition.y += 1
        break
      case 'left':
        frontPosition.x -= 1
        break
      case 'right':
        frontPosition.x += 1
        break
    }

    const object = gameObjects.find(
      obj => obj.position.x === frontPosition.x && obj.position.y === frontPosition.y
    )

    if (object) {
      setPopupContent(`${object.type === 'pot' ? '壺' : '宝箱'}を見つけました！`)
      setShowPopup(true)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          handleMove('up')
          break
        case 'ArrowDown':
          handleMove('down')
          break
        case 'ArrowLeft':
          handleMove('left')
          break
        case 'ArrowRight':
          handleMove('right')
          break
        case 'z':
          handleInteract()
          break
        case 'Enter':
          if (showPopup) {
            setShowPopup(false)
          } else {
            handleInteract()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [playerPosition, showPopup])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-start bg-gray-900 overflow-hidden">
      <div className="flex-1 flex items-start justify-center min-h-0 p-4 sm:items-center sm:pt-4 pt-8">
        <div className="relative">
          <Map width={8} height={8} />
          <Character position={playerPosition} direction={playerDirection} />
          <div className="absolute top-0 left-0 right-0 bottom-0">
            {gameObjects.map((obj, index) => (
              <GameObject
                key={`${obj.type}-${index}`}
                type={obj.type}
                position={obj.position}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full max-w-md p-4">
        <TouchControls onMove={handleMove} onInteract={handleInteract} />
      </div>
      {showPopup && <Popup content={popupContent} onClose={() => setShowPopup(false)} />}
    </div>
  )
} 