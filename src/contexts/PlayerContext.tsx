'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { PlayerStatus } from '../types/player'
import { initialPlayerStatus } from '~/stories/providers'

interface PlayerContextType {
  playerStatus: PlayerStatus
  updatePlayerStatus: (status: Partial<PlayerStatus>) => void
  resetPlayerStatus: () => void
}


const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>(initialPlayerStatus)

  const updatePlayerStatus = (status: Partial<PlayerStatus>) => {
    setPlayerStatus(prev => ({ ...prev, ...status }))
  }

  const resetPlayerStatus = () => {
    setPlayerStatus(initialPlayerStatus)
  }

  return (
    <PlayerContext.Provider value={{ playerStatus, updatePlayerStatus, resetPlayerStatus }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }

  return context
} 