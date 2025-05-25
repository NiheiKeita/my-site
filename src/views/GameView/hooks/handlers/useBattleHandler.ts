import React, { useCallback } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { playerStatusAtom, updatePlayerStatusAtom } from '~/store/player'
import { playerPositionAtom } from '~/store/playerPosition'
import { currentMapAtom, writeCurrentMapAtom } from '~/store/currentMap'
import { maps } from '~/data/maps'
import { enemies } from '~/data/enemies'
import type { BattleResult } from '~/types/enemy'
import type { GameState } from '../types'

export const useBattleHandler = (
  state: GameState,
  dispatch: React.Dispatch<any>
) => {
  const [playerStatus, setPlayerStatus] = useAtom(playerStatusAtom)
  const updatePlayerStatus = useSetAtom(updatePlayerStatusAtom)
  const [, setPlayerPosition] = useAtom(playerPositionAtom)
  const [currentMap] = useAtom(currentMapAtom)
  const setCurrentMap = useSetAtom(writeCurrentMapAtom)

  const handleRandomEncounter = useCallback(() => {
    if (!state.isInBattle) {
      const randomEnemy = currentMap.enemies[Math.floor(Math.random() * currentMap.enemies.length)]
      const targetEnemy = enemies.find(enemy => enemy.id === randomEnemy.id)
      if (!targetEnemy) throw new Error("enemy not find")
      dispatch({ type: 'SET_BATTLE_STATE', payload: { isInBattle: true, enemy: targetEnemy } })
    }
  }, [state.isInBattle, currentMap.enemies, dispatch])

  const handleBattleEnd = useCallback((result: BattleResult) => {
    // 勝った時の処理
    if (result.isVictory) {
      updatePlayerStatus({
        exp: playerStatus.exp + result.exp,
        gold: playerStatus.gold + result.gold,
      })
    }
    // 負けた時の処理
    if (!result.isVictory && !result.isEscaped) {
      setPlayerStatus(prev => ({ ...prev, hp: prev.maxHp }))
      updatePlayerStatus({
        gold: Math.floor(playerStatus.gold / 2),
      })
      setCurrentMap(maps[0])
      setPlayerPosition({ x: 4, y: 4 })
    }
    dispatch({ type: 'SET_BATTLE_STATE', payload: { isInBattle: false, enemy: null } })
  }, [updatePlayerStatus, playerStatus.exp, playerStatus.gold, setPlayerStatus, setCurrentMap, setPlayerPosition, dispatch])

  return {
    handleRandomEncounter,
    handleBattleEnd
  }
} 