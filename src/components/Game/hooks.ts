import React from 'react'
import { useState, useCallback, useEffect } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { playerStatusAtom, updatePlayerStatusAtom } from '../../store/player'
import { Enemy, BattleResult } from '../../types/enemy'
import { MapData } from '../../types/game'
import { maps } from '../../constants/maps'
import { enemies } from '../../data/enemies'

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

  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (showPopup || showCommandMenu) return

    setPlayerDirection(direction)
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

    const isCollision = currentMap.gameObjects.some(
      (obj) => obj.position.x === newPosition.x && obj.position.y === newPosition.y &&
        obj.type !== 'fountain' && obj.type !== 'stairs'
    )

    if (isCollision) {
      newPosition.x = playerPosition.x
      newPosition.y = playerPosition.y
    }

    setPlayerPosition(newPosition)

    const fountain = currentMap.gameObjects.find(
      (obj) => obj.position.x === newPosition.x && obj.position.y === newPosition.y && obj.type === 'fountain'
    )
    if (fountain && playerStatus.hp < playerStatus.maxHp) {
      setPlayerStatus(prev => ({ ...prev, hp: prev.maxHp }))
      setPopupContent('HPが全回復した！')
      setShowPopup(true)
    }

    const stairs = currentMap.gameObjects.find(
      (obj) => obj.position.x === newPosition.x && obj.position.y === newPosition.y && obj.type === 'stairs'
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

    if (Math.random() < 0.04) {
      if (isInBattle) return
      const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)]
      setCurrentEnemy(randomEnemy)
      setIsInBattle(true)
    }
  }, [playerPosition, showPopup, showCommandMenu, currentMap, isInBattle, playerStatus])

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

    if (object) {
      setPopupContent(object.message)
      setShowPopup(true)
    } else {
      setShowCommandMenu(true)
    }
  }, [playerPosition, playerDirection, showPopup, currentMap])

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
  }, [playerStatus, updatePlayerStatus])

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
    setShowCommandMenu,
  }
} 