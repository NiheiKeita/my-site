import { GameState, GameAction } from './types'

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_BATTLE_STATE':
      return {
        ...state,
        isInBattle: action.payload.isInBattle,
        currentEnemy: action.payload.enemy
      }
    case 'SET_PLAYER_DIRECTION':
      return {
        ...state,
        playerDirection: action.payload
      }
    case 'SHOW_POPUP':
      return {
        ...state,
        showPopup: true,
        popupContent: action.payload
      }
    case 'HIDE_POPUP':
      return {
        ...state,
        showPopup: false,
        popupContent: ''
      }
    case 'TOGGLE_COMMAND_MENU':
      return {
        ...state,
        showCommandMenu: !state.showCommandMenu
      }
    case 'HIDE_COMMAND_MENU':
      return {
        ...state,
        showCommandMenu: false
      }
    case 'SET_PREVIOUS_LEVEL':
      return {
        ...state,
        previousLevel: action.payload
      }
    default:
      return state
  }
} 