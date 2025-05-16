import { useState, useEffect } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right';

export const useTouchControls = (
  onMove: (direction: Direction) => void,
  onInteract: () => void
) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleTouchMove = (direction: Direction) => {
    onMove(direction)
  }

  const handleTouchInteract = () => {
    onInteract()
  }

  return {
    isMobile,
    handleTouchMove,
    handleTouchInteract,
  }
} 