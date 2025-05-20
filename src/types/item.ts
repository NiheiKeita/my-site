export type ItemType = 'weapon' | 'armor' | 'potion' | 'key' | 'material'

export interface Item {
  id: string
  name: string
  description: string
  type: ItemType
  effect?: {
    hp?: number
    attack?: number
    defense?: number
  }
  value: number
  image: string
  x: number
  y: number
} 