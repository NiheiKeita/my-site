import React from 'react'
import { Enemy } from '~/types/enemy'

export type GameState = {
  isInBattle: boolean
  currentEnemy: Enemy | null
  playerDirection: 'up' | 'down' | 'left' | 'right'
  showPopup: boolean
  popupContent: React.ReactNode
  showCommandMenu: boolean
  previousLevel: number
}

export type GameAction =
  | { type: 'SET_BATTLE_STATE'; payload: { isInBattle: boolean; enemy: Enemy | null } }
  | { type: 'SET_PLAYER_DIRECTION'; payload: 'up' | 'down' | 'left' | 'right' }
  | { type: 'SHOW_POPUP'; payload: React.ReactNode }
  | { type: 'HIDE_POPUP' }
  | { type: 'TOGGLE_COMMAND_MENU' }
  | { type: 'HIDE_COMMAND_MENU' }
  | { type: 'SET_PREVIOUS_LEVEL'; payload: number }

export const initialState: GameState = {
  isInBattle: false,
  currentEnemy: null,
  playerDirection: 'down',
  showPopup: false,
  popupContent: '',
  showCommandMenu: false,
  previousLevel: 1
} 