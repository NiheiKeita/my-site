import { renderHook } from '@testing-library/react'
import { useBattleHandler } from '../useBattleHandler'
import { useAtom, useSetAtom } from 'jotai'
import { playerStatusAtom, updatePlayerStatusAtom } from '~/store/player'
import { playerPositionAtom } from '~/store/playerPosition'
import { currentMapAtom, writeCurrentMapAtom } from '~/store/currentMap'
import { enemies } from '~/data/enemies'
import { act } from 'react'

jest.mock('jotai', () => ({
  useAtom: jest.fn(),
  useSetAtom: jest.fn(),
  atom: jest.fn((initialValue) => initialValue)
}))

jest.mock('~/data/maps', () => ({
  maps: [{ id: 'test-map', enemies: [{ id: 'enemy1' }] }]
}))

jest.mock('~/data/enemies', () => ({
  enemies: [{ id: 'enemy1', name: 'Test Enemy', hp: 100, attack: 10, defense: 5 }]
}))

describe('useBattleHandler', () => {
  const mockDispatch = jest.fn()
  const mockSetPlayerStatus = jest.fn()
  const mockUpdatePlayerStatus = jest.fn()
  const mockSetPlayerPosition = jest.fn()
  const mockSetCurrentMap = jest.fn()

  const mockState = {
    isInBattle: false,
    currentEnemy: null,
    showPopup: false,
    popupContent: '',
    showCommandMenu: false,
    previousLevel: 1,
    playerDirection: 'down' as const
  }

  const mockPlayerStatus = {
    hp: 100,
    maxHp: 100,
    exp: 0,
    gold: 100
  }

  const mockCurrentMap = {
    id: 'test-map',
    enemies: [{ id: 'enemy1' }]
  }

  beforeEach(() => {
    jest.clearAllMocks()
      ; (useAtom as jest.Mock).mockImplementation((atom) => {
        if (atom === playerStatusAtom) return [mockPlayerStatus, mockSetPlayerStatus]
        if (atom === playerPositionAtom) return [{ x: 5, y: 5 }, mockSetPlayerPosition]
        if (atom === currentMapAtom) return [mockCurrentMap]

        return [null]
      })
      ; (useSetAtom as jest.Mock).mockImplementation((atom) => {
        if (atom === updatePlayerStatusAtom) return mockUpdatePlayerStatus
        if (atom === writeCurrentMapAtom) return mockSetCurrentMap

        return jest.fn()
      })
  })

  describe('handleRandomEncounter', () => {
    it('should trigger random encounter when not in battle', () => {
      const { result } = renderHook(() => useBattleHandler(mockState, mockDispatch))

      act(() => {
        result.current.handleRandomEncounter()
      })

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_BATTLE_STATE',
        payload: {
          isInBattle: true,
          enemy: enemies[0]
        }
      })
    })

    it('should not trigger random encounter when in battle', () => {
      const battleState = { ...mockState, isInBattle: true }
      const { result } = renderHook(() => useBattleHandler(battleState, mockDispatch))

      act(() => {
        result.current.handleRandomEncounter()
      })

      expect(mockDispatch).not.toHaveBeenCalled()
    })
  })

}) 