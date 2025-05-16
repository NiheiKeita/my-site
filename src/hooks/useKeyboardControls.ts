import { useEffect } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right';

export const useKeyboardControls = (
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
        case 'Enter':
          onInteract()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onMove, onInteract])
} 