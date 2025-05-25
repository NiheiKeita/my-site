import React, { useEffect } from 'react'
import type { GameState } from '../types'

export const useKeyboardHandler = (
  state: GameState,
  dispatch: React.Dispatch<any>,
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void,
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
          dispatch({ type: 'TOGGLE_COMMAND_MENU' })
          break
        case 'Enter':
          if (state.showPopup) {
            dispatch({ type: 'HIDE_POPUP' })
          } else if (state.showCommandMenu) {
            dispatch({ type: 'HIDE_COMMAND_MENU' })
          } else {
            onInteract()
          }
          break
        case 'Escape':
          dispatch({ type: 'HIDE_COMMAND_MENU' })
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onMove, onInteract, state.showPopup, state.showCommandMenu, dispatch])
} 