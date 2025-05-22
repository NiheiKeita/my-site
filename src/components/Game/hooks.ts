import React from 'react'
import { useState, useCallback, useEffect } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { playerStatusAtom, updatePlayerStatusAtom } from '../../store/player'
import { Enemy, BattleResult } from '../../types/enemy'
import { MapData, GameObjectData } from '../../types/game'
import { maps } from '../../data/maps'
import { enemies } from '~/data/enemies'
import { addBagItemAtom } from '~/store/bag'

interface Position {
  x: number
  y: number
}

export const useGameLogic = () => {
  const [playerStatus, setPlayerStatus] = useAtom(playerStatusAtom)
  const updatePlayerStatus = useSetAtom(updatePlayerStatusAtom)
  const [isInBattle, setIsInBattle] = useState(false)
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null)
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 4, y: 4 })
  const [playerDirection, setPlayerDirection] = useState<'up' | 'down' | 'left' | 'right'>('down')
  const [showPopup, setShowPopup] = useState(false)
  const [popupContent, setPopupContent] = useState<React.ReactNode>('')
  const [showCommandMenu, setShowCommandMenu] = useState(false)
  const [currentMap, setCurrentMap] = useState<MapData>(maps[0])
  const [previousLevel, setPreviousLevel] = useState(playerStatus.level)
  const addBagItem = useSetAtom(addBagItemAtom)

  // レベルアップのチェック
  useEffect(() => {
    if (playerStatus.level > previousLevel) {
      const levelUpMessage = [
        '✨ レベルアップ！ ✨',
        `レベル ${previousLevel} → ${playerStatus.level}`,
        `HP: ${playerStatus.maxHp - 20} → ${playerStatus.maxHp}`,
        `攻撃力: ${playerStatus.attack - 5} → ${playerStatus.attack}`,
        `防御力: ${playerStatus.defense - 3} → ${playerStatus.defense}`
      ].join('\n')

      setPopupContent(levelUpMessage)
      setShowPopup(true)
      setPreviousLevel(playerStatus.level)
    }
  }, [playerStatus.level, previousLevel, playerStatus.maxHp, playerStatus.attack, playerStatus.defense])

  // 移動先の座標を計算
  const calculateNextPosition = useCallback((direction: 'up' | 'down' | 'left' | 'right'): Position => {
    const newPosition = { ...playerPosition }

    switch (direction) {
      case 'up':
        newPosition.y = Math.max(0, playerPosition.y - 1)
        break
      case 'down':
        newPosition.y = Math.min(currentMap.height - 1, playerPosition.y + 1)
        break
      case 'left':
        newPosition.x = Math.max(0, playerPosition.x - 1)
        break
      case 'right':
        newPosition.x = Math.min(currentMap.width - 1, playerPosition.x + 1)
        break
    }

    return newPosition
  }, [playerPosition, currentMap])

  // オブジェクトとの衝突チェック
  const checkObjectCollision = useCallback((position: Position): GameObjectData | undefined => {
    return currentMap.gameObjects.find(
      (obj) => obj.position.x === position.x && obj.position.y === position.y &&
        obj.type !== 'fountain' && obj.type !== 'stairs' && obj.type !== 'item'
    )
  }, [currentMap])

  // 泉との衝突処理
  const handleFountainCollision = useCallback((position: Position) => {
    const fountain = currentMap.gameObjects.find(
      (obj) => obj.position.x === position.x && obj.position.y === position.y && obj.type === 'fountain'
    )
    if (fountain && playerStatus.hp < playerStatus.maxHp) {
      setPlayerStatus(prev => ({ ...prev, hp: prev.maxHp }))
      setPopupContent('HPが全回復した！')
      setShowPopup(true)
    }
  }, [currentMap, playerStatus, setPlayerStatus])

  // 階段との衝突処理
  const handleStairCollision = useCallback((position: Position) => {
    const stairs = currentMap.gameObjects.find(
      (obj) => obj.position.x === position.x && obj.position.y === position.y && obj.type === 'stairs'
    )
    if (stairs) {
      if (stairs.direction === 'down' && currentMap.stairs?.down) {
        const nextMap = maps.find(map => map.id === currentMap.stairs?.down?.mapId)
        if (nextMap) {
          setCurrentMap(nextMap)
          setPlayerPosition(currentMap.stairs.down.position)
        }
      } else if (stairs.direction === 'up' && currentMap.stairs?.up) {
        const prevMap = maps.find(map => map.id === currentMap.stairs?.up?.mapId)
        if (prevMap) {
          setCurrentMap(prevMap)
          setPlayerPosition(currentMap.stairs.up.position)
        }
      }
    }
  }, [currentMap])

  // エンカウント処理
  const handleRandomEncounter = useCallback(() => {
    if (!isInBattle) {
      const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)]
      setCurrentEnemy(randomEnemy)
      setIsInBattle(true)
    }
  }, [isInBattle])

  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (showPopup || showCommandMenu) return

    setPlayerDirection(direction)
    const newPosition = calculateNextPosition(direction)
    if (playerPosition.x === newPosition.x && playerPosition.y === newPosition.y) {
      // 壁にぶつかってる時は何も処理をしない
      return
    }

    const collidedObject = checkObjectCollision(newPosition)
    if (collidedObject) {
      return
    }

    // ランダムエンカウント処理
    const isEncounter = Math.random() < 0.04 && !isInBattle
    if (isEncounter) {
      handleRandomEncounter()

      return
    }

    handleFountainCollision(newPosition)
    handleStairCollision(newPosition)
    setPlayerPosition(newPosition)
  }, [showPopup, showCommandMenu, calculateNextPosition, checkObjectCollision, handleFountainCollision, handleStairCollision, handleRandomEncounter, setPlayerPosition, isInBattle, playerPosition])

  const handleInteract = useCallback(() => {
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

    const object = currentMap.gameObjects.find(
      obj => obj.position.x === frontPosition.x && obj.position.y === frontPosition.y
    )
    const nowObject = currentMap.gameObjects.find(
      obj => obj.position.x === playerPosition.x && obj.position.y === playerPosition.y
    )

    if (nowObject) {
      if (nowObject.type === 'item') {
        // アイテムを拾った時
        setPopupContent(`${nowObject.itemId}を拾った`)
        setShowPopup(true)
        //TODO: アイテムを拾った時の処理
        if (nowObject.itemId) {
          addBagItem(nowObject.itemId)
        }
      }
    } else if (object) {
      setPopupContent(object.message)
      setShowPopup(true)
    } else {
      setShowCommandMenu(true)
    }
  }, [playerPosition, playerDirection, showPopup, currentMap, addBagItem])

  const handleBattleEnd = useCallback((result: BattleResult) => {
    if (result.isVictory) {
      updatePlayerStatus({
        exp: playerStatus.exp + result.exp,
        gold: playerStatus.gold + result.gold,
      })
    } else {
      setPlayerStatus(prev => ({ ...prev, hp: prev.maxHp }))
    }
    setIsInBattle(false)
    setCurrentEnemy(null)
  }, [playerStatus, updatePlayerStatus, setPlayerStatus])

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
  }, [handleMove, handleInteract, showPopup, showCommandMenu])

  return {
    playerStatus,
    setPlayerStatus,
    isInBattle,
    currentEnemy,
    playerPosition,
    playerDirection,
    showPopup,
    popupContent,
    showCommandMenu,
    currentMap,
    handleMove,
    handleInteract,
    handleBattleEnd,
    setShowPopup,
    setShowCommandMenu
  }
} 