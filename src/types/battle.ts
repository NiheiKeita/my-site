export type BattleCommand = 'fight' | 'run' | 'attack' | 'spell' | 'item' | 'back'
export type BattlePhase = 'initial' | 'action'

export interface BattleState {
  phase: BattlePhase
  isPlayerTurn: boolean
  isAttacking: boolean
  isHealing: boolean
  message: string
  isBattleEnd: boolean
  isVictory: boolean
}

export interface Spell {
  id: string
  name: string
  mp: number
  description: string
  effect: {
    type: 'damage' | 'heal' | 'buff' | 'debuff'
    value: number
  }
} 