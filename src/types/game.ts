import { ReactNode } from 'react'

export interface Position {
  x: number
  y: number
}

export type GameObjectType = 'pot' | 'chest' | 'fountain' | 'stairs' | 'npc' | 'item' | 'android'
export type StairDirection = 'up' | 'down'

export interface AndroidApp {
  id: string
  name: string
  url: string
}

export type GameObjectData = {
  id: string
  type: GameObjectType
  position: Position
  message: ReactNode
  direction?: 'up' | 'down'
  itemId?: string
  requiredKey?: string
  // requiredKey?: 'bronze' | 'silver' | 'gold' | 'mythril' | 'legendary'
  contents?: {
    itemId: string
    quantity: number
  }[]
  isOpened?: boolean
}

export interface StairData {
  mapId: string
  position: Position
}

export interface StairConnections {
  up?: StairData
  down?: StairData
}

export interface MapData {
  id: string
  name: string
  width: number
  height: number
  gameObjects: GameObjectData[]
  stairs?: StairConnections
  enemies: { id: number }[]
} 
