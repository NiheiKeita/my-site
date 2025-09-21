import { renderHook } from '@testing-library/react'
import { useInteractionHandler } from '../useInteractionHandler'
import { useAtom, useSetAtom } from 'jotai'
import { currentMapAtom } from '~/store/currentMap'
import { addBagItemAtom, addPickedItemAtom, bagItemsAtom } from '~/store/bag'
import { addOpenedChestAtom } from '~/store/chest'
import type { GameState } from '../../types'
import type { GameObjectData } from '~/types/game'

jest.mock('jotai', () => ({
  useAtom: jest.fn(),
  useSetAtom: jest.fn(),
  atom: jest.fn((initialValue) => initialValue),
}))

jest.mock('~/store/currentMap', () => ({
  currentMapAtom: 'currentMapAtom',
}))

jest.mock('~/store/bag', () => ({
  addBagItemAtom: 'addBagItemAtom',
  addPickedItemAtom: 'addPickedItemAtom',
  bagItemsAtom: 'bagItemsAtom',
}))

jest.mock('~/store/chest', () => ({
  addOpenedChestAtom: 'addOpenedChestAtom',
}))

describe('useInteractionHandler', () => {
  const mockSend = jest.fn()
  const mockAddBagItem = jest.fn()
  const mockAddPickedItem = jest.fn()
  const mockAddOpenedChest = jest.fn()
  const mockSetBagItems = jest.fn()

  const createMockState = (contextOverrides: Partial<GameState['context']> = {}): GameState => ({
    value: 'exploration',
    context: {
      currentEnemy: null,
      playerDirection: 'up',
      showPopup: false,
      popupContent: '',
      showCommandMenu: false,
      previousLevel: 1,
      ...contextOverrides,
    },
    matches: () => false,
  }) as unknown as GameState

  const mockChest: GameObjectData = {
    id: 'chest_1',
    type: 'chest',
    position: { x: 0, y: -1 },
    message: '宝箱だ',
    contents: [
      {
        itemId: 'healing_potion',
        quantity: 2,
      },
    ],
  }

  const mockBoss: GameObjectData = {
    id: 'boss_1',
    type: 'enemy',
    position: { x: 5, y: 4 },
    message: 'ボスが現れた！',
    enemyId: 12,
  }

  const mockOpenedChest: GameObjectData = {
    id: 'chest_1',
    type: 'chest',
    position: { x: 0, y: -1 },
    message: '宝箱だ',
    isOpened: true,
  }

  const mockLockedChest: GameObjectData = {
    id: 'chest_1',
    type: 'chest',
    position: { x: 0, y: -1 },
    message: '宝箱だ',
    requiredKey: 'silver',
    contents: [
      {
        itemId: 'healing_potion',
        quantity: 2,
      },
    ],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
    ;(useAtom as jest.Mock).mockImplementation((atom) => {
      if (atom === currentMapAtom) {
        return [{
          id: 'first-floor',
          gameObjects: [mockChest],
        }]
      }
      if (atom === bagItemsAtom) {
        return [['bronze_key'], mockSetBagItems]
      }

      return [null, jest.fn()]
    })
    ;(useSetAtom as jest.Mock).mockImplementation((atom) => {
      if (atom === addBagItemAtom) return mockAddBagItem
      if (atom === addPickedItemAtom) return mockAddPickedItem
      if (atom === addOpenedChestAtom) return mockAddOpenedChest

      return jest.fn()
    })
  })

  describe('handleInteract', () => {
    it('宝箱を開いてアイテムを追加する', () => {
      const { result } = renderHook(() =>
        useInteractionHandler(
          createMockState(),
          mockSend,
          { x: 0, y: 0 },
        ),
      )

      result.current.handleInteract()

      expect(mockSetBagItems).toHaveBeenCalled()
      expect(mockAddOpenedChest).toHaveBeenCalledWith({
        mapId: 'first-floor',
        objectId: 'chest_1',
      })
      expect(mockSend).toHaveBeenCalledWith({
        type: 'SHOW_POPUP',
        content: '回復薬を2個手に入れた！',
      })
    })

    it('ボスと対話すると戦闘が開始される', () => {
      jest.useFakeTimers()
      ;(useAtom as jest.Mock).mockImplementation((atom) => {
        if (atom === currentMapAtom) {
          return [{
            id: 'first-floor',
            gameObjects: [mockBoss],
          }]
        }
        if (atom === bagItemsAtom) {
          return [['bronze_key'], mockSetBagItems]
        }

        return [null, jest.fn()]
      })

      const { result } = renderHook(() =>
        useInteractionHandler(
          createMockState(),
          mockSend,
          { x: 5, y: 5 },
        ),
      )

      result.current.handleInteract()

      expect(mockSend).toHaveBeenCalledWith({
        type: 'SHOW_POPUP',
        content: 'ボスが現れた！',
      })

      jest.runAllTimers()

      expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
        type: 'ENTER_BATTLE',
      }))
    })

    it('既に開けられた宝箱は開けない', () => {
      (useAtom as jest.Mock).mockImplementation((atom) => {
        if (atom === currentMapAtom) {
          return [{
            id: 'first-floor',
            gameObjects: [mockOpenedChest],
          }]
        }
        if (atom === bagItemsAtom) {
          return [['bronze_key'], mockSetBagItems]
        }

        return [null, jest.fn()]
      })

      const { result } = renderHook(() =>
        useInteractionHandler(
          createMockState(),
          mockSend,
          { x: 0, y: 0 },
        ),
      )

      result.current.handleInteract()

      expect(mockSend).toHaveBeenCalledWith({
        type: 'SHOW_POPUP',
        content: 'この宝箱は既に開けられている',
      })
      expect(mockSetBagItems).not.toHaveBeenCalled()
      expect(mockAddOpenedChest).not.toHaveBeenCalled()
    })

    it('鍵が必要な宝箱を鍵なしで開こうとするとメッセージを表示', () => {
      (useAtom as jest.Mock).mockImplementation((atom) => {
        if (atom === currentMapAtom) {
          return [{
            id: 'first-floor',
            gameObjects: [mockLockedChest],
          }]
        }
        if (atom === bagItemsAtom) {
          return [[], mockSetBagItems]
        }

        return [null, jest.fn()]
      })

      const { result } = renderHook(() =>
        useInteractionHandler(
          createMockState(),
          mockSend,
          { x: 0, y: 0 },
        ),
      )

      result.current.handleInteract()

      expect(mockSend).toHaveBeenCalledWith({
        type: 'SHOW_POPUP',
        content: '宝箱だ',
      })
      expect(mockSetBagItems).not.toHaveBeenCalled()
      expect(mockAddOpenedChest).not.toHaveBeenCalled()
    })

    it('鍵を持っている場合は宝箱を開けることができる', () => {
      (useAtom as jest.Mock).mockImplementation((atom) => {
        if (atom === currentMapAtom) {
          return [{
            id: 'first-floor',
            gameObjects: [mockLockedChest],
          }]
        }
        if (atom === bagItemsAtom) {
          return [['silver'], mockSetBagItems]
        }

        return [null, jest.fn()]
      })

      const { result } = renderHook(() =>
        useInteractionHandler(
          createMockState(),
          mockSend,
          { x: 0, y: 0 },
        ),
      )

      result.current.handleInteract()

      expect(mockSetBagItems).toHaveBeenCalled()
      expect(mockAddOpenedChest).toHaveBeenCalledWith({
        mapId: 'first-floor',
        objectId: 'chest_1',
      })
      expect(mockSend).toHaveBeenCalledWith({
        type: 'SHOW_POPUP',
        content: '回復薬を2個手に入れた！',
      })
    })
  })
})
