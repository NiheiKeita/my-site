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
    const handleCloseMenu = () => send({ type: 'CLOSE_MENU' })
    const handleOpenMenu = () => send({ type: 'OPEN_MENU' })
    const handleHidePopup = () => send({ type: 'HIDE_POPUP' })

    const handleKeyDown = (event: KeyboardEvent) => {
      const { showPopup, showCommandMenu } = state.context

      switch (event.key) {
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
          if (showCommandMenu) {
            handleCloseMenu()
          } else {
            handleOpenMenu()
          }
          break
        case 'Enter':
          if (showPopup) {
            handleHidePopup()
          } else if (showCommandMenu) {
            handleCloseMenu()
          } else {
            onInteract()
          }
          break
        case 'Escape':
          if (showCommandMenu) {
            handleCloseMenu()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.context, onMove, onInteract, send])
}
