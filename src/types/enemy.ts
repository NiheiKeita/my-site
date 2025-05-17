export interface Enemy {
  id: string
  name: string
  hp: number
  maxHp: number
  attack: number
  defense: number
  image: string
  level: number
  exp: number
  gold: number
}

export interface BattleState {
  isPlayerTurn: boolean
  isAttacking: boolean
  message: string
  isBattleEnd: boolean
  isVictory: boolean
} 