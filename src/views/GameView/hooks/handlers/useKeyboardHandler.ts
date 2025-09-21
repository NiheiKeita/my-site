import { useEffect } from 'react'
import type { GameSend, GameState } from '../types'
import type { Direction } from '../../machine'

export const useKeyboardHandler = (
  state: GameState,
  send: GameSend,
  onMove: (direction: Direction) => void,
  onInteract: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          onMove('up')
          break
        case 'ArrowDown':
          onMove('down')
          break
        case 'ArrowLeft':
          onMove('left')
          break
        case 'ArrowRight':
          onMove('right')
          break
        case 'z':
          if (state.context.showCommandMenu) {
            send({ type: 'CLOSE_MENU' })
          } else {
            send({ type: 'OPEN_MENU' })
          }
          break
        case 'Enter':
          if (state.context.showPopup) {
            send({ type: 'HIDE_POPUP' })
          } else if (state.context.showCommandMenu) {
            send({ type: 'CLOSE_MENU' })
          } else {
            onInteract()
          }
          break
        case 'Escape':
          if (state.context.showCommandMenu) {
            send({ type: 'CLOSE_MENU' })
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onMove, onInteract, state.context.showPopup, state.context.showCommandMenu, send])
}
