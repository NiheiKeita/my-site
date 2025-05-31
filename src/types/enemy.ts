export interface Enemy {
  id: number
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

export interface BattleResult {
  isVictory: boolean
  isEscaped: boolean
  exp: number
  gold: number
  hp: number
  mp: number
}

export interface BattleState {
  isPlayerTurn: boolean
  isAttacking: boolean
  message: string
  isBattleEnd: boolean
  isVictory: boolean
} 