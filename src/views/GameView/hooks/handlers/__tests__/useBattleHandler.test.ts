import { renderHook } from '@testing-library/react'
import { useBattleHandler } from '../useBattleHandler'
import { useAtom, useSetAtom } from 'jotai'
import { playerStatusAtom, updatePlayerStatusAtom } from '~/store/player'
import { playerPositionAtom } from '~/store/playerPosition'
import { currentMapAtom, writeCurrentMapAtom } from '~/store/currentMap'
import { enemies } from '~/data/enemies'
import { act } from 'react'
import type { GameState } from '../../types'

jest.mock('jotai', () => ({
  useAtom: jest.fn(),
  useSetAtom: jest.fn(),
  atom: jest.fn((initialValue) => initialValue),
}))

jest.mock('~/data/maps', () => ({
  maps: [{ id: 'test-map', enemies: [{ id: 'enemy1' }] }],
}))

jest.mock('~/data/enemies', () => ({
  enemies: [{ id: 'enemy1', name: 'Test Enemy', hp: 100, attack: 10, defense: 5 }],
}))

describe('useBattleHandler', () => {
  const mockSend = jest.fn()
  const mockSetPlayerStatus = jest.fn()
  const mockUpdatePlayerStatus = jest.fn()
  const mockSetPlayerPosition = jest.fn()
  const mockSetCurrentMap = jest.fn()

  const createMockState = (value: 'exploration' | 'battle' = 'exploration'): GameState => ({
    value,
    context: {
      currentEnemy: null,
      playerDirection: 'down',
      showPopup: false,
      popupContent: '',
      showCommandMenu: false,
      previousLevel: 1,
    },
    matches: (v: string | string[]) => {
      if (Array.isArray(v)) {
        return v.includes(value)
      }
      
return v === value
    },
  }) as unknown as GameState

  const mockPlayerStatus = {
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    exp: 0,
    gold: 100,
  }

  const mockCurrentMap = {
    id: 'test-map',
    enemies: [{ id: 'enemy1' }],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAtom as jest.Mock).mockImplementation((atom) => {
      if (atom === playerStatusAtom) return [mockPlayerStatus, mockSetPlayerStatus]
      if (atom === playerPositionAtom) return [{ x: 5, y: 5 }, mockSetPlayerPosition]
      if (atom === currentMapAtom) return [mockCurrentMap]

      return [null]
    })
    ;(useSetAtom as jest.Mock).mockImplementation((atom) => {
      if (atom === updatePlayerStatusAtom) return mockUpdatePlayerStatus
      if (atom === writeCurrentMapAtom) return mockSetCurrentMap

      return jest.fn()
    })
  })

  describe('handleRandomEncounter', () => {
    it('戦闘中でない場合、ランダムエンカウントが発生すること', () => {
      const { result } = renderHook(() => useBattleHandler(createMockState(), mockSend))

      act(() => {
        result.current.handleRandomEncounter()
      })

      expect(mockSend).toHaveBeenCalledWith({ type: 'ENTER_BATTLE', enemy: enemies[0] })
    })

    it('戦闘中の場合、ランダムエンカウントが発生しないこと', () => {
      const { result } = renderHook(() => useBattleHandler(createMockState('battle'), mockSend))

      act(() => {
        result.current.handleRandomEncounter()
      })

      expect(mockSend).not.toHaveBeenCalled()
    })
  })

  describe('handleBattleEnd', () => {
    it('戦闘に勝利した場合、経験値とゴールドが増加すること', () => {
      const { result } = renderHook(() => useBattleHandler(createMockState(), mockSend))

      act(() => {
        result.current.handleBattleEnd({ isVictory: true, isEscaped: false, exp: 100, gold: 50, hp: 90, mp: 40 })
      })

      expect(mockUpdatePlayerStatus).toHaveBeenCalledWith({
        exp: 100,
        gold: 150,
        hp: 90,
        mp: 40,
      })
      expect(mockSend).toHaveBeenNthCalledWith(1, { type: 'END_BATTLE' })
      expect(mockSend).toHaveBeenNthCalledWith(2, {
        type: 'SHOW_POPUP',
        content: '100の経験値を獲得した！\n50ゴールドを手に入れた！',
      })
    })

    it('戦闘に敗北した場合、HPが回復し、ゴールドが半減すること', () => {
      const { result } = renderHook(() => useBattleHandler(createMockState(), mockSend))

      act(() => {
        result.current.handleBattleEnd({ isVictory: false, isEscaped: false, exp: 0, gold: 0, hp: 40, mp: 10 })
      })

      expect(mockSetPlayerStatus).toHaveBeenCalledWith(expect.any(Function))
      const statusUpdater = mockSetPlayerStatus.mock.calls[0][0]
      expect(statusUpdater(mockPlayerStatus)).toEqual({
        ...mockPlayerStatus,
        hp: mockPlayerStatus.maxHp,
      })
      expect(mockUpdatePlayerStatus).toHaveBeenCalledWith({
        gold: 50,
      })
      expect(mockSetPlayerPosition).toHaveBeenCalledWith({ x: 4, y: 4 })
      expect(mockSend).toHaveBeenLastCalledWith({ type: 'END_BATTLE' })
    })

    it('戦闘から逃走した場合、ステータスが更新されること', () => {
      const { result } = renderHook(() => useBattleHandler(createMockState('battle'), mockSend))

      act(() => {
        result.current.handleBattleEnd({ isVictory: false, isEscaped: true, exp: 0, gold: 0, hp: 70, mp: 20 })
      })

      expect(mockUpdatePlayerStatus).toHaveBeenCalledWith({
        hp: 70,
        mp: 20,
      })
      expect(mockSetCurrentMap).not.toHaveBeenCalled()
      expect(mockSetPlayerPosition).not.toHaveBeenCalled()
      expect(mockSend).toHaveBeenCalledWith({ type: 'END_BATTLE' })
    })

    it('報酬がゼロの場合はポップアップを表示しない', () => {
      const { result } = renderHook(() => useBattleHandler(createMockState(), mockSend))

      act(() => {
        result.current.handleBattleEnd({ isVictory: true, isEscaped: false, exp: 0, gold: 0, hp: 50, mp: 20 })
      })

      expect(mockSend).toHaveBeenCalledWith({ type: 'END_BATTLE' })
      expect(mockSend).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'SHOW_POPUP' }))
    })
  })
})
