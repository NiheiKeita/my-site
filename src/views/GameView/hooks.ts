import { useCallback, useEffect } from 'react'
import { useAtom } from 'jotai'
import { useMachine } from '@xstate/react'
import { playerPositionAtom } from '~/store/playerPosition'
import { currentMapAtom } from '~/store/currentMap'
import { useMovementHandler } from './hooks/handlers/useMovementHandler'
import { useBattleHandler } from './hooks/handlers/useBattleHandler'
import { useInteractionHandler } from './hooks/handlers/useInteractionHandler'
import { useKeyboardHandler } from './hooks/handlers/useKeyboardHandler'
import { playerStatusAtom } from '~/store/player'
import { gameMachine } from './machine'

export const useGameLogic = () => {
  const [state, send] = useMachine(gameMachine)
  const { context } = state
  const {
    currentEnemy,
    playerDirection,
    showPopup,
    popupContent,
    showCommandMenu,
    previousLevel,
  } = context
  const isInBattle = state.matches('battle')
  const [playerStatus, setPlayerStatus] = useAtom(playerStatusAtom)
  const [playerPosition] = useAtom(playerPositionAtom)
  const [currentMap] = useAtom(currentMapAtom)

  const emitPopup = useCallback((content: string) => {
    send({ type: 'SHOW_POPUP', content })
  }, [send])

  const { handleRandomEncounter, handleBattleEnd } = useBattleHandler(state, send)
  const { handleMove } = useMovementHandler(state, send, handleRandomEncounter)
  const { handleInteract } = useInteractionHandler(state, send, playerPosition)

  useKeyboardHandler(state, send, handleMove, handleInteract)

  useEffect(() => {
    if (playerStatus.level <= previousLevel) return

    const levelUpMessage = [
      '✨ レベルアップ！ ✨',
      `レベル ${previousLevel} → ${playerStatus.level}`,
      `HP: ${playerStatus.maxHp - 20} → ${playerStatus.maxHp}`,
      `攻撃力: ${playerStatus.attack - 5} → ${playerStatus.attack}`,
      `防御力: ${playerStatus.defense - 3} → ${playerStatus.defense}`,
    ].join('\n')

    emitPopup(levelUpMessage)
    send({ type: 'SET_PREVIOUS_LEVEL', level: playerStatus.level })
  }, [
    previousLevel,
    emitPopup,
    playerStatus.attack,
    playerStatus.defense,
    playerStatus.level,
    playerStatus.maxHp,
    send,
  ])

  const setShowPopup = useCallback((show: boolean) => {
    if (show) {
      emitPopup('')
    } else {
      send({ type: 'HIDE_POPUP' })
    }
  }, [emitPopup, send])

  const setShowCommandMenu = useCallback((show: boolean) => {
    send({ type: show ? 'OPEN_MENU' : 'CLOSE_MENU' })
  }, [send])

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
