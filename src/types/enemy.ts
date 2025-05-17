export interface Enemy {
  id: string
  name: string
  level: number
  hp: number
  maxHp: number
  attack: number
  defense: number
  exp: number
  gold: number
  image: string
  defeatedImage: string
}

export interface BattleState {
  isPlayerTurn: boolean
  isAttacking: boolean
  message: string
  isBattleEnd: boolean
  isVictory: boolean
} 