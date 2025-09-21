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
  actions: {
    setDirection: assign(({ event }) => {
      if (event.type !== 'SET_DIRECTION') return {}
      
return { playerDirection: event.direction }
    }),
    showPopup: assign(({ event }) => {
      if (event.type !== 'SHOW_POPUP') return {}
      
return { showPopup: true, popupContent: event.content }
    }),
    hidePopup: assign(() => ({
      showPopup: false,
      popupContent: '',
    })),
    openMenu: assign(() => ({
      showCommandMenu: true,
    })),
    closeMenu: assign(() => ({
      showCommandMenu: false,
    })),
    setEnemy: assign(({ event }) => {
      if (event.type !== 'ENTER_BATTLE') return {}
      
return { currentEnemy: event.enemy }
    }),
    clearEnemy: assign(() => ({
      currentEnemy: null,
    })),
    setPreviousLevel: assign(({ event }) => {
      if (event.type !== 'SET_PREVIOUS_LEVEL') return {}
      
return { previousLevel: event.level }
    }),
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
          actions: ['setEnemy'],
        },
      },
    },
    battle: {
      entry: ['closeMenu'],
      exit: ['clearEnemy'],
      on: {
        END_BATTLE: 'exploration',
      },
    },
  },
  on: {
    SET_DIRECTION: {
      actions: ['setDirection'],
    },
    SHOW_POPUP: {
      actions: ['showPopup'],
    },
    HIDE_POPUP: {
      actions: ['hidePopup'],
    },
    OPEN_MENU: {
      actions: ['openMenu'],
    },
    CLOSE_MENU: {
      actions: ['closeMenu'],
    },
    SET_PREVIOUS_LEVEL: {
      actions: ['setPreviousLevel'],
    },
  },
})
