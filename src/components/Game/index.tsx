'use client'

import { useEffect, useState, useCallback } from 'react'
import { Character } from '../Character'
import { Map, calculateGridSize } from '../Map'
import { TouchControls } from '../TouchControls'
import { Popup } from '../Popup'
import { GameObject } from '../GameObject'
import { CommandMenu } from '../CommandMenu'
import { BattleView } from '../../views/BattleView'
import { enemies } from '../../data/enemies'
import { useAtom, useSetAtom } from 'jotai'
import { playerStatusAtom, updatePlayerStatusAtom } from '../../store/player'
import { Enemy, BattleResult } from '../../types/enemy'

interface Position {
  x: number
  y: number
}

interface GameObjectData {
  type: 'pot' | 'chest'
  position: Position
}

export const Game = () => {
  const [playerStatus] = useAtom(playerStatusAtom)
  const updatePlayerStatus = useSetAtom(updatePlayerStatusAtom)
  const [isInBattle, setIsInBattle] = useState(false)
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null)
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 4, y: 4 })
  const [playerDirection, setPlayerDirection] = useState<'up' | 'down' | 'left' | 'right'>('down')
  const [showPopup, setShowPopup] = useState(false)
  const [popupContent, setPopupContent] = useState('')
  const [gridSize, setGridSize] = useState(48)
  const [showCommandMenu, setShowCommandMenu] = useState(false)
  const [gameObjects] = useState<GameObjectData[]>([
    { type: 'pot', position: { x: 2, y: 2 } },
    { type: 'pot', position: { x: 5, y: 2 } },
    { type: 'chest', position: { x: 2, y: 5 } },
    { type: 'chest', position: { x: 5, y: 5 } },
  ])

  // グリッドサイズの更新
  useEffect(() => {
    const updateGridSize = () => {
      setGridSize(calculateGridSize(8, 8))
    }

    // 初期サイズを計算
    updateGridSize()

    // リサイズイベントのリスナーを追加
    window.addEventListener('resize', updateGridSize)

    // クリーンアップ
    return () => window.removeEventListener('resize', updateGridSize)
  }, [])

  // // ランダムエンカウントの処理
  // useEffect(() => {
  //   if (isInBattle) return

  //   const handleMove = () => {
  //     // 10%の確率でエンカウント
  //     if (Math.random() < 0.1) {
  //       const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)]
  //       setCurrentEnemy(randomEnemy)
  //       setIsInBattle(true)
  //     }
  //   }

  //   window.addEventListener('keydown', handleMove)
  //   return () => window.removeEventListener('keydown', handleMove)
  // }, [isInBattle])

  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    // ポップアップ表示中またはコマンドメニュー表示中は移動しない
    if (showPopup || showCommandMenu) return

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
      if (isInBattle) return
      const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)]
      setCurrentEnemy(randomEnemy)
      setIsInBattle(true)
      // const messages = [
      //   '何かが動いた気がする...',
      //   '風の音が聞こえる...',
      //   '遠くで何かの音がする...',
      //   '不思議な気配を感じる...',
      //   '何かが光っている...',
      // ]
      // const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      // setPopupContent(randomMessage)
      // setShowPopup(true)
    }
  }, [playerPosition, showPopup, showCommandMenu, gameObjects, isInBattle])

  const handleInteract = useCallback(() => {
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
    } else {
      // オブジェクトがない場合はコマンドメニューを表示
      setShowCommandMenu(true)
    }
  }, [playerPosition, playerDirection, showPopup, gameObjects])

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
          } else if (showCommandMenu) {
            setShowCommandMenu(false)
          } else {
            handleInteract()
          }
          break
        case 'Escape':
          if (showCommandMenu) {
            setShowCommandMenu(false)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [playerPosition, showPopup, showCommandMenu, handleMove, handleInteract])

  const handleBattleEnd = (result: BattleResult) => {
    if (result.isVictory) {
      updatePlayerStatus({
        exp: playerStatus.exp + result.exp,
        gold: playerStatus.gold + result.gold,
      })
    } else {
      updatePlayerStatus({
        hp: playerStatus.maxHp, // HPを全回復
      })
    }
    setIsInBattle(false)
    setCurrentEnemy(null)
  }

  if (isInBattle && currentEnemy !== null) {
    return <BattleView enemy={currentEnemy} onBattleEnd={handleBattleEnd} />
  }

  return (
    <div className="relative flex size-full items-center justify-center">
      <div className="fixed inset-0 bg-gray-900" />
      {/* ステータス表示 */}
      <div className="fixed left-4 bottom-4 z-2 rounded bg-black/50 p-2 text-white">
        <p>Lv.{playerStatus.level}</p>
        <div className="h-4 w-48 rounded bg-gray-700">
          <div
            className="h-full rounded bg-green-500"
            style={{ width: `${(playerStatus.hp / playerStatus.maxHp) * 100}%` }}
          />
        </div>
        <p>HP: {playerStatus.hp}/{playerStatus.maxHp}</p>
        <p>EXP: {playerStatus.exp}</p>
        <p>GOLD: {playerStatus.gold}</p>
      </div>

      <div className="relative">
        <Map width={8} height={8} />
        <Character position={playerPosition} direction={playerDirection} gridSize={gridSize} />
        <div className="absolute inset-0">
          {gameObjects.map((obj, index) => (
            <GameObject
              key={`${obj.type}-${index}`}
              type={obj.type}
              position={obj.position}
              gridSize={gridSize}
            />
          ))}
        </div>
      </div>

      <TouchControls onMove={handleMove} onInteract={handleInteract} />
      {showPopup && <Popup content={popupContent} onClose={() => setShowPopup(false)} />}
      {showCommandMenu && <CommandMenu onClose={() => setShowCommandMenu(false)} />}
    </div>
  )
} 