'use client'

import React from "react"
import { PlayerProvider } from "../contexts/PlayerContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return <PlayerProvider>{children}</PlayerProvider>
} 