'use client'

import { useState } from 'react'
import { useKeyboardControls } from '../../hooks/useKeyboardControls'
import { useTouchControls } from '../../hooks/useTouchControls'
import { Character } from '../Character'
import { Map } from '../Map'
import { TouchControls } from '../TouchControls'
import { Popup } from '../Popup'

interface Position {
  x: number;
  y: number;
}

interface GameObject {
  id: string;
  type: 'pot' | 'chest';
  position: Position;
}

export const Game = () => {
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 4, y: 4 })
  const [playerDirection, setPlayerDirection] = useState<'up' | 'down' | 'left' | 'right'>('down')
  const [showPopup, setShowPopup] = useState(false)
  const [popupContent, setPopupContent] = useState('')

  const objects: GameObject[] = [
    { id: '1', type: 'pot', position: { x: 2, y: 2 } },
    { id: '2', type: 'chest', position: { x: 5, y: 3 } },
    { id: '3', type: 'pot', position: { x: 6, y: 6 } },
    { id: '4', type: 'chest', position: { x: 3, y: 5 } },
  ]

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    setPlayerDirection(direction)
    const newPosition = { ...playerPosition }

    switch (direction) {
      case 'up':
        newPosition.y -= 1
        break
      case 'down':
        newPosition.y += 1
        break
      case 'left':
        newPosition.x -= 1
        break
      case 'right':
        newPosition.x += 1
        break
    }

    // マップの境界チェック
    if (newPosition.x >= 0 && newPosition.x < 8 && newPosition.y >= 0 && newPosition.y < 8) {
      // オブジェクトとの衝突チェック
      const isCollision = objects.some(
        obj => obj.position.x === newPosition.x && obj.position.y === newPosition.y
      )
      if (!isCollision) {
        setPlayerPosition(newPosition)
      }
    }
  }

  const handleInteract = () => {
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

    const object = objects.find(
      obj => obj.position.x === frontPosition.x && obj.position.y === frontPosition.y
    )

    if (object) {
      setPopupContent(`${object.type === 'pot' ? '壺' : '宝箱'}を見つけました！`)
      setShowPopup(true)
    }
  }

  useKeyboardControls(handleMove, handleInteract)
  const { isMobile, handleTouchMove, handleTouchInteract } = useTouchControls(handleMove, handleInteract)

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-gray-900">
      <div className="relative">
        <Map width={8} height={8} />
        <Character position={playerPosition} direction={playerDirection} />
        {objects.map(obj => (
          <div
            key={obj.id}
            className="absolute size-8"
            style={{
              left: `${obj.position.x * 32}px`,
              top: `${obj.position.y * 32}px`,
              backgroundImage: `url(/assets/objects/${obj.type}.png)`,
              backgroundSize: 'contain',
            }}
          />
        ))}
      </div>
      {isMobile && <TouchControls onMove={handleTouchMove} onInteract={handleTouchInteract} />}
      {showPopup && <Popup content={popupContent} onClose={() => setShowPopup(false)} />}
    </div>
  )
} 