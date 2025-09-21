import { assign, setup } from 'xstate'
import { ReactNode } from 'react'
import { Enemy } from '~/types/enemy'

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface GameContext {
  currentEnemy: Enemy | null
  playerDirection: Direction
  popupContent: ReactNode
  showPopup: boolean
  showCommandMenu: boolean
  previousLevel: number
}

export type GameEvent =
  | { type: 'SET_DIRECTION'; direction: Direction }
  | { type: 'SHOW_POPUP'; content: ReactNode }
  | { type: 'HIDE_POPUP' }
  | { type: 'OPEN_MENU' }
  | { type: 'CLOSE_MENU' }
  | { type: 'ENTER_BATTLE'; enemy: Enemy }
  | { type: 'END_BATTLE' }
  | { type: 'SET_PREVIOUS_LEVEL'; level: number }

export const initialGameContext: GameContext = {
  currentEnemy: null,
  playerDirection: 'down',
  popupContent: '',
  showPopup: false,
  showCommandMenu: false,
  previousLevel: 1,
}

export const gameMachine = setup({
  types: {
    context: {} as GameContext,
    events: {} as GameEvent,
  },
}).createMachine({
  id: 'game',
  context: initialGameContext,
  initial: 'exploration',
  states: {
    exploration: {
      on: {
        ENTER_BATTLE: {
          target: 'battle',
          actions: assign(({ event }) => ({
            currentEnemy: event.enemy,
          })),
        },
      },
    },
    battle: {
      entry: assign({
        showCommandMenu: () => false,
      }),
      exit: assign({
        currentEnemy: () => null,
      }),
      on: {
        END_BATTLE: 'exploration',
      },
    },
  },
  on: {
    SET_DIRECTION: {
      actions: assign(({ event }) => ({
        playerDirection: event.direction,
      })),
    },
    SHOW_POPUP: {
      actions: assign(({ event }) => ({
        showPopup: true,
        popupContent: event.content,
      })),
    },
    HIDE_POPUP: {
      actions: assign(() => ({
        showPopup: false,
        popupContent: '',
      })),
    },
    OPEN_MENU: {
      actions: assign(() => ({
        showCommandMenu: true,
      })),
    },
    CLOSE_MENU: {
      actions: assign(() => ({
        showCommandMenu: false,
      })),
    },
    SET_PREVIOUS_LEVEL: {
      actions: assign(({ event }) => ({
        previousLevel: event.level,
      })),
    },
  },
})
