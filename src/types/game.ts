import { ReactNode } from 'react'

export interface Position {
  x: number
  y: number
}

export interface GameObjectData {
  type: 'pot' | 'chest' | 'fountain' | 'stairs' | 'npc' | 'item' | 'android'
  position: Position
  message: ReactNode
  direction?: 'up' | 'down'
  app?: {
    id: string
    name: string
    url: string
  }
}

export interface StairData {
  mapId: string
  position: Position
}

export interface MapData {
  id: string
  name: string
  width: number
  height: number
  gameObjects: GameObjectData[]
  stairs?: {
    up?: StairData
    down?: StairData
  }
} 