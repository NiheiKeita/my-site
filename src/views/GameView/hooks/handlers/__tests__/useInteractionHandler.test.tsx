import { renderHook } from '@testing-library/react'
import { useInteractionHandler } from '../useInteractionHandler'
import { useAtom, useSetAtom } from 'jotai'
import { currentMapAtom } from '~/store/currentMap'
import { addBagItemAtom, addPickedItemAtom, bagItemsAtom } from '~/store/bag'
import { addOpenedChestAtom } from '~/store/chest'
import type { GameState } from '../../types'
import type { GameObjectData } from '~/types/game'

// jotaiのモック
jest.mock('jotai', () => ({
  useAtom: jest.fn(),
  useSetAtom: jest.fn(),
  atom: jest.fn((initialValue) => initialValue)
}))

// モジュールのモック
jest.mock('~/store/currentMap', () => ({
  currentMapAtom: 'currentMapAtom'
}))

jest.mock('~/store/bag', () => ({
  addBagItemAtom: 'addBagItemAtom',
  addPickedItemAtom: 'addPickedItemAtom',
  bagItemsAtom: 'bagItemsAtom'
}))

jest.mock('~/store/chest', () => ({
  addOpenedChestAtom: 'addOpenedChestAtom'
}))

describe('useInteractionHandler', () => {
  const mockDispatch = jest.fn()
  const mockAddBagItem = jest.fn()
  const mockAddPickedItem = jest.fn()
  const mockAddOpenedChest = jest.fn()
  const mockSetBagItems = jest.fn()

  const mockGameState: GameState = {
    isInBattle: false,
    currentEnemy: null,
    playerDirection: 'up',
    showPopup: false,
    popupContent: '',
    showCommandMenu: false,
    previousLevel: 1
  }

  const mockChest: GameObjectData = {
    id: 'chest_1',
    type: 'chest',
    position: { x: 0, y: -1 }, // プレイヤーの前方
    message: '宝箱だ',
    contents: [
      {
        itemId: 'healing_potion',
        quantity: 2
      }
    ]
  }

  const mockOpenedChest: GameObjectData = {
    id: 'chest_1',
    type: 'chest',
    position: { x: 0, y: -1 },
    message: '宝箱だ',
    isOpened: true
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
        quantity: 2
      }
    ]
  }

  beforeEach(() => {
    jest.clearAllMocks()
      ; (useAtom as jest.Mock).mockImplementation((atom) => {
        if (atom === currentMapAtom) {
          return [{
            id: 'first-floor',
            gameObjects: [mockChest]
          }]
        }
        if (atom === bagItemsAtom) {
          return [['bronze_key'], mockSetBagItems]
        }
        return [null, jest.fn()]
      })
      ; (useSetAtom as jest.Mock).mockImplementation((atom) => {
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
          mockGameState,
          mockDispatch,
          { x: 0, y: 0 }
        )
      )

      result.current.handleInteract()

      expect(mockSetBagItems).toHaveBeenCalled()
      expect(mockAddOpenedChest).toHaveBeenCalledWith({
        mapId: 'first-floor',
        objectId: 'chest_1'
      })
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SHOW_POPUP',
        payload: '回復薬を2個手に入れた！'
      })
    })

    it('既に開けられた宝箱は開けない', () => {
      ; (useAtom as jest.Mock).mockImplementation((atom) => {
        if (atom === currentMapAtom) {
          return [{
            id: 'first-floor',
            gameObjects: [mockOpenedChest]
          }]
        }
        if (atom === bagItemsAtom) {
          return [['bronze_key'], mockSetBagItems]
        }
        return [null, jest.fn()]
      })

      const { result } = renderHook(() =>
        useInteractionHandler(
          mockGameState,
          mockDispatch,
          { x: 0, y: 0 }
        )
      )

      result.current.handleInteract()

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SHOW_POPUP',
        payload: 'この宝箱は既に開けられている'
      })
      expect(mockSetBagItems).not.toHaveBeenCalled()
      expect(mockAddOpenedChest).not.toHaveBeenCalled()
    })

    it('鍵が必要な宝箱を鍵なしで開こうとするとメッセージを表示', () => {
      ; (useAtom as jest.Mock).mockImplementation((atom) => {
        if (atom === currentMapAtom) {
          return [{
            id: 'first-floor',
            gameObjects: [mockLockedChest]
          }]
        }
        if (atom === bagItemsAtom) {
          return [[], mockSetBagItems] // 鍵を持っていない状態
        }
        return [null, jest.fn()]
      })

      const { result } = renderHook(() =>
        useInteractionHandler(
          mockGameState,
          mockDispatch,
          { x: 0, y: 0 }
        )
      )

      result.current.handleInteract()

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SHOW_POPUP',
        payload: 'この宝箱を開けるには特別な鍵が必要だ'
      })
      expect(mockSetBagItems).not.toHaveBeenCalled()
      expect(mockAddOpenedChest).not.toHaveBeenCalled()
    })

    it('鍵を持っている場合は宝箱を開けることができる', () => {
      ; (useAtom as jest.Mock).mockImplementation((atom) => {
        if (atom === currentMapAtom) {
          return [{
            id: 'first-floor',
            gameObjects: [mockLockedChest]
          }]
        }
        if (atom === bagItemsAtom) {
          return [['silver'], mockSetBagItems] // 銀の鍵を持っている状態
        }
        return [null, jest.fn()]
      })

      const { result } = renderHook(() =>
        useInteractionHandler(
          mockGameState,
          mockDispatch,
          { x: 0, y: 0 }
        )
      )

      result.current.handleInteract()

      expect(mockSetBagItems).toHaveBeenCalled()
      expect(mockAddOpenedChest).toHaveBeenCalledWith({
        mapId: 'first-floor',
        objectId: 'chest_1'
      })
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SHOW_POPUP',
        payload: '回復薬を2個手に入れた！'
      })
    })
  })
}) 