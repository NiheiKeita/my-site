import { renderHook } from '@testing-library/react'
import { useKeyboardHandler } from '../useKeyboardHandler'
import type { GameState } from '../../types'

const createMockState = (contextOverrides: Partial<GameState['context']> = {}): GameState => ({
  value: 'exploration',
  context: {
    currentEnemy: null,
    playerDirection: 'down',
    showPopup: false,
    popupContent: '',
    showCommandMenu: false,
    previousLevel: 1,
    ...contextOverrides,
  },
  matches: () => false,
}) as unknown as GameState

describe('useKeyboardHandler', () => {
  const mockSend = jest.fn()
  const mockOnMove = jest.fn()
  const mockOnInteract = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('矢印キーで移動できること', () => {
    renderHook(() => useKeyboardHandler(createMockState(), mockSend, mockOnMove, mockOnInteract))

    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
    const directions = ['up', 'down', 'left', 'right']

    arrowKeys.forEach((key, index) => {
      const event = new KeyboardEvent('keydown', { key })
      window.dispatchEvent(event)
      expect(mockOnMove).toHaveBeenCalledWith(directions[index])
    })
  })

  it('Zキーでコマンドメニューが切り替わること', () => {
    renderHook(() => useKeyboardHandler(createMockState(), mockSend, mockOnMove, mockOnInteract))

    const event = new KeyboardEvent('keydown', { key: 'z' })
    window.dispatchEvent(event)

    expect(mockSend).toHaveBeenCalledWith({ type: 'OPEN_MENU' })
  })

  it('ポップアップ表示中にEnterキーを押すとポップアップが非表示になること', () => {
    renderHook(() => useKeyboardHandler(createMockState({ showPopup: true }), mockSend, mockOnMove, mockOnInteract))

    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    window.dispatchEvent(event)

    expect(mockSend).toHaveBeenCalledWith({ type: 'HIDE_POPUP' })
  })

  it('コマンドメニュー表示中にEnterキーを押すとコマンドメニューが非表示になること', () => {
    renderHook(() => useKeyboardHandler(createMockState({ showCommandMenu: true }), mockSend, mockOnMove, mockOnInteract))

    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    window.dispatchEvent(event)

    expect(mockSend).toHaveBeenCalledWith({ type: 'CLOSE_MENU' })
  })

  it('ポップアップやコマンドメニューがない場合はEnterキーでインタラクションが実行されること', () => {
    renderHook(() => useKeyboardHandler(createMockState(), mockSend, mockOnMove, mockOnInteract))

    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    window.dispatchEvent(event)

    expect(mockOnInteract).toHaveBeenCalled()
  })

  it('Escapeキーでコマンドメニューが非表示になること', () => {
    renderHook(() => useKeyboardHandler(createMockState({ showCommandMenu: true }), mockSend, mockOnMove, mockOnInteract))

    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    window.dispatchEvent(event)

    expect(mockSend).toHaveBeenCalledWith({ type: 'CLOSE_MENU' })
  })
})
