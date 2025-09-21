import { useEffect } from 'react'
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
  const [playerStatus, setPlayerStatus] = useAtom(playerStatusAtom)
  const [playerPosition] = useAtom(playerPositionAtom)
  const [currentMap] = useAtom(currentMapAtom)

  const { handleRandomEncounter, handleBattleEnd } = useBattleHandler(state, send)
  const { handleMove } = useMovementHandler(state, send, handleRandomEncounter)
  const { handleInteract } = useInteractionHandler(state, send, playerPosition)

  useKeyboardHandler(state, send, handleMove, handleInteract)

  useEffect(() => {
    if (playerStatus.level > state.context.previousLevel) {
      const levelUpMessage = [
        '✨ レベルアップ！ ✨',
        `レベル ${state.context.previousLevel} → ${playerStatus.level}`,
        `HP: ${playerStatus.maxHp - 20} → ${playerStatus.maxHp}`,
        `攻撃力: ${playerStatus.attack - 5} → ${playerStatus.attack}`,
        `防御力: ${playerStatus.defense - 3} → ${playerStatus.defense}`,
      ].join('\n')
      send({ type: 'SHOW_POPUP', content: `${levelUpMessage}` })
      send({ type: 'SET_PREVIOUS_LEVEL', level: playerStatus.level })
    }
  }, [
    playerStatus.attack,
    playerStatus.defense,
    playerStatus.level,
    playerStatus.maxHp,
    send,
    state.context.previousLevel,
  ])

  return {
    playerStatus,
    setPlayerStatus,
    isInBattle: state.matches('battle'),
    currentEnemy: state.context.currentEnemy,
    playerPosition,
    playerDirection: state.context.playerDirection,
    showPopup: state.context.showPopup,
    popupContent: state.context.popupContent,
    showCommandMenu: state.context.showCommandMenu,
    currentMap,
    handleMove,
    handleInteract,
    handleBattleEnd,
    setShowPopup: (show: boolean) => {
      if (show) {
        send({ type: 'SHOW_POPUP', content: '' })
      } else {
        send({ type: 'HIDE_POPUP' })
      }
    },
    setShowCommandMenu: (show: boolean) => {
      if (show) {
        send({ type: 'OPEN_MENU' })
      } else {
        send({ type: 'CLOSE_MENU' })
      }
    },
  }
}
