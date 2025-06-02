export type ItemType = 'weapon' | 'armor' | 'potion' | 'key' | 'material'

export type ItemEffect = {
  hp?: number
  attack?: number
  defense?: number
  mp?: number
  exp?: number
}

export interface Item {
  id: string
  name: string
  description: string
  type: ItemType
  effect?: ItemEffect
  value: number
  image: string
  consumable: boolean
  price?: number
  sellPrice?: number
} 