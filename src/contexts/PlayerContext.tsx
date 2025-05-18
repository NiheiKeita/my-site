'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { PlayerStatus } from '../types/player'

interface PlayerContextType {
  playerStatus: PlayerStatus
  updatePlayerStatus: (status: Partial<PlayerStatus>) => void
  resetPlayerStatus: () => void
}

const initialPlayerStatus: PlayerStatus = {
  hp: 100,
  maxHp: 100,
  level: 1,
  exp: 0,
  gold: 0,
  attack: 10,
  defense: 5,
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