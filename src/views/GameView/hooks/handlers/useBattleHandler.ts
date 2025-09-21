import { useCallback } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { playerStatusAtom, updatePlayerStatusAtom } from '~/store/player'
import { playerPositionAtom } from '~/store/playerPosition'
import { currentMapAtom, writeCurrentMapAtom } from '~/store/currentMap'
import { maps } from '~/data/maps'
import { enemies } from '~/data/enemies'
import type { BattleResult } from '~/types/enemy'
import type { GameSend, GameState } from '../types'

export const useBattleHandler = (
  state: GameState,
  send: GameSend
) => {
  const [playerStatus, setPlayerStatus] = useAtom(playerStatusAtom)
  const updatePlayerStatus = useSetAtom(updatePlayerStatusAtom)
  const [, setPlayerPosition] = useAtom(playerPositionAtom)
  const [currentMap] = useAtom(currentMapAtom)
  const setCurrentMap = useSetAtom(writeCurrentMapAtom)

  const pickRandomEnemy = useCallback(() => {
    const pool = currentMap.enemies
    if (!pool.length) return null
    const randomEncounter = pool[Math.floor(Math.random() * pool.length)]
    
return enemies.find(candidate => candidate.id === randomEncounter.id) ?? null
  }, [currentMap.enemies])

  const handleRandomEncounter = useCallback(() => {
    if (state.matches('battle')) return

    const targetEnemy = pickRandomEnemy()
    if (!targetEnemy) return

    send({ type: 'ENTER_BATTLE', enemy: targetEnemy })
  }, [state, pickRandomEnemy, send])

  const handleDefeat = useCallback(() => {
    setPlayerStatus(prev => ({ ...prev, hp: prev.maxHp }))
    updatePlayerStatus({
      gold: Math.floor(playerStatus.gold / 2),
    })
    setCurrentMap(maps[0])
    setPlayerPosition({ x: 4, y: 4 })
  }, [playerStatus.gold, setPlayerPosition, setPlayerStatus, setCurrentMap, updatePlayerStatus])

  const handleVictory = useCallback((result: BattleResult) => {
    updatePlayerStatus({
      exp: playerStatus.exp + result.exp,
      gold: playerStatus.gold + result.gold,
      hp: result.hp,
      mp: result.mp,
    })
  }, [playerStatus.exp, playerStatus.gold, updatePlayerStatus])

  const handleEscape = useCallback((result: BattleResult) => {
    updatePlayerStatus({
      hp: result.hp,
      mp: result.mp,
    })
  }, [updatePlayerStatus])

  const handleBattleEnd = useCallback((result: BattleResult) => {
    if (result.isVictory) {
      handleVictory(result)
    } else if (!result.isEscaped) {
      handleDefeat()
    } else {
      handleEscape(result)
    }

    send({ type: 'END_BATTLE' })
  }, [handleVictory, handleDefeat, handleEscape, send])

  return {
    handleRandomEncounter,
    handleBattleEnd,
  }
}
