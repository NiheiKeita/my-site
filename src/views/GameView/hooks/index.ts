import { useReducer, useEffect } from 'react'
import { useAtom } from 'jotai'
import { playerPositionAtom } from '~/store/playerPosition'
import { currentMapAtom } from '~/store/currentMap'
import { gameReducer } from './reducer'
import { useMovementHandler } from './handlers/useMovementHandler'
import { useBattleHandler } from './handlers/useBattleHandler'
import { useInteractionHandler } from './handlers/useInteractionHandler'
import { useKeyboardHandler } from './handlers/useKeyboardHandler'
import { initialState } from './types'
import { playerStatusAtom } from '~/store/player'

export const useGameLogic = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const [playerStatus, setPlayerStatus] = useAtom(playerStatusAtom)
  const [playerPosition] = useAtom(playerPositionAtom)
  const [currentMap] = useAtom(currentMapAtom)

  const { handleRandomEncounter, handleBattleEnd } = useBattleHandler(state, dispatch)
  const { handleMove } = useMovementHandler(state, dispatch, handleRandomEncounter)
  const { handleInteract } = useInteractionHandler(state, dispatch, playerPosition)

  useKeyboardHandler(state, dispatch, handleMove, handleInteract)

  useEffect(() => {
    if (playerStatus.level > state.previousLevel) {
      const levelUpMessage = [
        '✨ レベルアップ！ ✨',
        `レベル ${playerStatus.level - 1} → ${playerStatus.level}`,
        `HP: ${playerStatus.maxHp - 20} → ${playerStatus.maxHp}`,
        `攻撃力: ${playerStatus.attack - 5} → ${playerStatus.attack}`,
        `防御力: ${playerStatus.defense - 3} → ${playerStatus.defense}`
      ].join('\n')
      dispatch({
        type: 'SHOW_POPUP',
        payload: `${levelUpMessage}`
      })
      dispatch({ type: 'SET_PREVIOUS_LEVEL', payload: playerStatus.level })
    }
  }, [playerStatus.attack, playerStatus.defense, playerStatus.level, playerStatus.maxHp, state.previousLevel])

  return {
    playerStatus,
    setPlayerStatus,
    isInBattle: state.isInBattle,
    currentEnemy: state.currentEnemy,
    playerPosition,
    playerDirection: state.playerDirection,
    showPopup: state.showPopup,
    popupContent: state.popupContent,
    showCommandMenu: state.showCommandMenu,
    currentMap,
    handleMove,
    handleInteract,
    handleBattleEnd,
    setShowPopup: (show: boolean) => {
      if (show) {
        dispatch({ type: 'SHOW_POPUP', payload: '' })
      } else {
        dispatch({ type: 'HIDE_POPUP' })
      }
    },
    setShowCommandMenu: (show: boolean) => {
      if (show) {
        dispatch({ type: 'TOGGLE_COMMAND_MENU' })
      } else {
        dispatch({ type: 'HIDE_COMMAND_MENU' })
      }
    }
  }
} 