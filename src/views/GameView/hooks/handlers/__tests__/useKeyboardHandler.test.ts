import { renderHook } from '@testing-library/react'
import { useKeyboardHandler } from '../useKeyboardHandler'

describe('useKeyboardHandler', () => {
  const mockDispatch = jest.fn()
  const mockOnMove = jest.fn()
  const mockOnInteract = jest.fn()

  const mockState = {
    isInBattle: false,
    currentEnemy: null,
    showPopup: false,
    popupContent: '',
    showCommandMenu: false,
    previousLevel: 1,
    playerDirection: 'down' as const
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('矢印キーで移動できること', () => {
    renderHook(() => useKeyboardHandler(mockState, mockDispatch, mockOnMove, mockOnInteract))

    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
    const directions = ['up', 'down', 'left', 'right']

    arrowKeys.forEach((key, index) => {
      const event = new KeyboardEvent('keydown', { key })
      window.dispatchEvent(event)
      expect(mockOnMove).toHaveBeenCalledWith(directions[index])
    })
  })

  it('Zキーでコマンドメニューが切り替わること', () => {
    renderHook(() => useKeyboardHandler(mockState, mockDispatch, mockOnMove, mockOnInteract))

    const event = new KeyboardEvent('keydown', { key: 'z' })
    window.dispatchEvent(event)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_COMMAND_MENU' })
  })

  it('ポップアップ表示中にEnterキーを押すとポップアップが非表示になること', () => {
    const stateWithPopup = { ...mockState, showPopup: true }
    renderHook(() => useKeyboardHandler(stateWithPopup, mockDispatch, mockOnMove, mockOnInteract))

    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    window.dispatchEvent(event)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'HIDE_POPUP' })
  })

  it('コマンドメニュー表示中にEnterキーを押すとコマンドメニューが非表示になること', () => {
    const stateWithCommandMenu = { ...mockState, showCommandMenu: true }
    renderHook(() => useKeyboardHandler(stateWithCommandMenu, mockDispatch, mockOnMove, mockOnInteract))

    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    window.dispatchEvent(event)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'HIDE_COMMAND_MENU' })
  })

  it('Enterキーでインタラクションが実行されること', () => {
    renderHook(() => useKeyboardHandler(mockState, mockDispatch, mockOnMove, mockOnInteract))

    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    window.dispatchEvent(event)

    expect(mockOnInteract).toHaveBeenCalled()
  })

  it('Escapeキーでコマンドメニューが非表示になること', () => {
    renderHook(() => useKeyboardHandler(mockState, mockDispatch, mockOnMove, mockOnInteract))

    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    window.dispatchEvent(event)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'HIDE_COMMAND_MENU' })
  })
}) 
