import React, { useCallback } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { playerPositionAtom } from '~/store/playerPosition'
import { currentMapAtom, writeCurrentMapAtom } from '~/store/currentMap'
import { playerStatusAtom } from '~/store/player'
import { maps } from '~/data/maps'
import type { Position } from '~/types/game'
import type { GameState } from '../types'
import { ENEMY_ENCOUNTER_RATE } from '~/data/constants'

export const useMovementHandler = (
  state: GameState,
  dispatch: React.Dispatch<any>,
  onRandomEncounter: () => void
) => {
  const [playerPosition, setPlayerPosition] = useAtom(playerPositionAtom)
  const [currentMap] = useAtom(currentMapAtom)
  const setCurrentMap = useSetAtom(writeCurrentMapAtom)
  const [playerStatus, setPlayerStatus] = useAtom(playerStatusAtom)

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
  const checkObjectCollision = useCallback((position: Position) => {
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
    if (fountain && (playerStatus.hp < playerStatus.maxHp || playerStatus.mp < playerStatus.maxMp)) {
      setPlayerStatus(prev => ({ ...prev, hp: prev.maxHp, mp: prev.maxMp }))
      dispatch({ type: 'SHOW_POPUP', payload: 'HP・MPが全回復した！' })
    }
  }, [currentMap, playerStatus, setPlayerStatus, dispatch])

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
  }, [currentMap, setCurrentMap, setPlayerPosition])

  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (state.showPopup || state.showCommandMenu) return

    dispatch({ type: 'SET_PLAYER_DIRECTION', payload: direction })
    const newPosition = calculateNextPosition(direction)
    if (playerPosition.x === newPosition.x && playerPosition.y === newPosition.y) {
      return
    }

    const collidedObject = checkObjectCollision(newPosition)
    if (collidedObject) {
      return
    }

    const isEncounter = Math.random() < ENEMY_ENCOUNTER_RATE && !state.isInBattle
    if (isEncounter) {
      onRandomEncounter()

      return
    }

    handleFountainCollision(newPosition)
    handleStairCollision(newPosition)
    setPlayerPosition(newPosition)
  }, [
    state.showPopup,
    state.showCommandMenu,
    state.isInBattle,
    calculateNextPosition,
    checkObjectCollision,
    handleFountainCollision,
    handleStairCollision,
    onRandomEncounter,
    setPlayerPosition,
    playerPosition,
    dispatch
  ])

  return {
    handleMove,
    calculateNextPosition,
    checkObjectCollision,
    handleFountainCollision,
    handleStairCollision
  }
} 