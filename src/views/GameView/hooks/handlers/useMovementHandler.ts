import { useCallback } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { playerPositionAtom } from '~/store/playerPosition'
import { currentMapAtom, writeCurrentMapAtom } from '~/store/currentMap'
import { playerStatusAtom } from '~/store/player'
import { maps } from '~/data/maps'
import type { Position } from '~/types/game'
import { ENEMY_ENCOUNTER_RATE } from '~/data/constants'
import type { GameSend, GameState } from '../types'
import type { Direction } from '../../machine'

const clampPosition = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const useMovementHandler = (
  state: GameState,
  send: GameSend,
  onRandomEncounter: () => void
) => {
  const [playerPosition, setPlayerPosition] = useAtom(playerPositionAtom)
  const [currentMap] = useAtom(currentMapAtom)
  const setCurrentMap = useSetAtom(writeCurrentMapAtom)
  const [playerStatus, setPlayerStatus] = useAtom(playerStatusAtom)

  const calculateNextPosition = useCallback((direction: Direction): Position => {
    const bounds = {
      x: currentMap.width - 1,
      y: currentMap.height - 1,
    }

    switch (direction) {
      case 'up':
        return { x: playerPosition.x, y: clampPosition(playerPosition.y - 1, 0, bounds.y) }
      case 'down':
        return { x: playerPosition.x, y: clampPosition(playerPosition.y + 1, 0, bounds.y) }
      case 'left':
        return { x: clampPosition(playerPosition.x - 1, 0, bounds.x), y: playerPosition.y }
      case 'right':
        return { x: clampPosition(playerPosition.x + 1, 0, bounds.x), y: playerPosition.y }
    }
  }, [playerPosition, currentMap.height, currentMap.width])

  const checkObjectCollision = useCallback((position: Position) => {
    return currentMap.gameObjects.find(
      obj => obj.position.x === position.x &&
        obj.position.y === position.y &&
        obj.type !== 'fountain' &&
        obj.type !== 'stairs' &&
        obj.type !== 'item'
    )
  }, [currentMap.gameObjects])

  const handleFountainCollision = useCallback((position: Position) => {
    const fountain = currentMap.gameObjects.find(
      obj => obj.type === 'fountain' && obj.position.x === position.x && obj.position.y === position.y,
    )

    if (!fountain) return
    if (playerStatus.hp >= playerStatus.maxHp && playerStatus.mp >= playerStatus.maxMp) return

    setPlayerStatus(prev => ({ ...prev, hp: prev.maxHp, mp: prev.maxMp }))
    send({ type: 'SHOW_POPUP', content: 'HP・MPが全回復した！' })
  }, [currentMap.gameObjects, playerStatus.hp, playerStatus.maxHp, playerStatus.mp, playerStatus.maxMp, setPlayerStatus, send])

  const handleStairCollision = useCallback((position: Position) => {
    const stairs = currentMap.gameObjects.find(
      obj => obj.type === 'stairs' && obj.position.x === position.x && obj.position.y === position.y,
    )
    if (!stairs) return

    if (stairs.direction === 'down' && currentMap.stairs?.down) {
      const nextMap = maps.find(map => map.id === currentMap.stairs?.down?.mapId)
      if (nextMap) {
        setCurrentMap(nextMap)
        setPlayerPosition(currentMap.stairs.down.position)
      }

      return
    }

    if (stairs.direction === 'up' && currentMap.stairs?.up) {
      const previousMap = maps.find(map => map.id === currentMap.stairs?.up?.mapId)
      if (previousMap) {
        setCurrentMap(previousMap)
        setPlayerPosition(currentMap.stairs.up.position)
      }
    }
  }, [currentMap.gameObjects, currentMap.stairs, setCurrentMap, setPlayerPosition])

  const handleMove = useCallback((direction: Direction) => {
    const isMovementLocked = state.context.showPopup || state.context.showCommandMenu
    if (isMovementLocked) return

    send({ type: 'SET_DIRECTION', direction })

    const nextPosition = calculateNextPosition(direction)
    const hasMoved = playerPosition.x !== nextPosition.x || playerPosition.y !== nextPosition.y
    if (!hasMoved) return

    const collidedObject = checkObjectCollision(nextPosition)
    if (collidedObject) return

    const shouldEncounter = Math.random() < ENEMY_ENCOUNTER_RATE && !state.matches('battle')
    if (shouldEncounter) {
      onRandomEncounter()

      return
    }

    handleFountainCollision(nextPosition)
    handleStairCollision(nextPosition)
    setPlayerPosition(nextPosition)
  }, [
    state,
    playerPosition,
    calculateNextPosition,
    checkObjectCollision,
    handleFountainCollision,
    handleStairCollision,
    onRandomEncounter,
    setPlayerPosition,
    send,
  ])

  return {
    handleMove,
    calculateNextPosition,
    checkObjectCollision,
    handleFountainCollision,
    handleStairCollision,
  }
}
